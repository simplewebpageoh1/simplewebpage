// netlify/functions/create-checkout-session.ts
type AddonKey =
  | "google_business"
  | "review_request"
  | "copy_refinement"
  | "domain_connection"
  | "additional_revisions";

const ADDONS: Record<AddonKey, { label: string; amountCad: number }> = {
  google_business: {
    label: "Google Business Profile setup (Add-on)",
    amountCad: 79,
  },
  review_request: {
    label: "Review request message setup (Add-on)",
    amountCad: 39,
  },
  copy_refinement: { label: "Copy refinement (Add-on)", amountCad: 49 },
  domain_connection: {
    label: "Domain connection — done for you (Add-on)",
    amountCad: 49,
  },
  additional_revisions: {
    label: "Additional revisions / small changes (Add-on)",
    amountCad: 39,
  },
};

function cadToCents(n: number) {
  return Math.round(n * 100);
}

function getSiteUrl(event: any) {
  // Netlify가 제공하는 URL 우선
  const envUrl =
    process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.SITE_URL;

  if (envUrl) return envUrl.replace(/\/$/, "");

  // 로컬 fallback
  const proto = event.headers["x-forwarded-proto"] || "http";
  const host = event.headers.host || "localhost:8888";
  return `${proto}://${host}`;
}

function toFormUrlEncoded(data: Record<string, any>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    params.append(k, String(v));
  }
  return params.toString();
}

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
      };
    }

    const ENABLE_AUTOMATIC_TAX =
      (process.env.ENABLE_AUTOMATIC_TAX || "false").toLowerCase() === "true";

    const body = JSON.parse(event.body || "{}");
    const template = body.template || "electrician";
    const theme = body.theme || "A";
    const addons: AddonKey[] = Array.isArray(body.addons) ? body.addons : [];

    const siteUrl = getSiteUrl(event);

    // ---- line items 만들기 (base + addons)
    // base: $129 CAD
    const lineItems: Array<{ name: string; amount: number; qty: number }> = [
      {
        name: `Website Template (${template})`,
        amount: cadToCents(129),
        qty: 1,
      },
    ];

    for (const key of addons) {
      const item = ADDONS[key];
      if (!item) continue;
      lineItems.push({
        name: item.label,
        amount: cadToCents(item.amountCad),
        qty: 1,
      });
    }

    // Stripe는 form-urlencoded로 nested params 필요
    // line_items[0][price_data][currency]=cad
    // line_items[0][price_data][product_data][name]=...
    // line_items[0][price_data][unit_amount]=...
    // line_items[0][quantity]=1

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set(
      "success_url",
      // IMPORTANT: SPA route is "/thank-you" (not "/thankyou").
      // Using the wrong path will hit the catch-all route and redirect users back to "/".
      `${siteUrl}/thank-you?paid=1&template=${encodeURIComponent(template)}&theme=${encodeURIComponent(theme)}&addons=${encodeURIComponent(addons.join(","))}`,
    );
    params.set(
      "cancel_url",
      `${siteUrl}/checkout?template=${encodeURIComponent(template)}&theme=${encodeURIComponent(theme)}&addons=${encodeURIComponent(addons.join(","))}`,
    );

    // automatic_tax
    if (ENABLE_AUTOMATIC_TAX) {
      params.set("automatic_tax[enabled]", "true");
    }

    // metadata
    params.set("metadata[template]", template);
    params.set("metadata[theme]", theme);
    params.set("metadata[addons]", addons.join(","));

    // line items
    lineItems.forEach((it, idx) => {
      params.set(`line_items[${idx}][price_data][currency]`, "cad");
      params.set(`line_items[${idx}][price_data][product_data][name]`, it.name);
      params.set(
        `line_items[${idx}][price_data][unit_amount]`,
        String(it.amount),
      );
      params.set(`line_items[${idx}][quantity]`, String(it.qty));
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Stripe session create failed",
          details: json,
        }),
      };
    }

    // json.url 로 redirect
    return {
      statusCode: 200,
      body: JSON.stringify({ url: json.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: String(err) }),
    };
  }
};
