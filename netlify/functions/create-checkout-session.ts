/// <reference types="node" />

// netlify/functions/create-checkout-session.ts
type AddonKey =
  | "google_business"
  | "review_request"
  | "copy_refinement"
  | "domain_connection"
  | "extra_revisions";

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

  // ✅ 과거/프론트 오타 키 (같은 금액으로 매핑)
  extra_revisions: {
    label: "Additional revisions / small changes (Add-on)",
    amountCad: 39,
  },
};

function cadToCents(n: number) {
  return Math.round(n * 100);
}

function getSiteUrl(event: any) {
  const envUrl =
    process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.SITE_URL;

  if (envUrl) return envUrl.replace(/\/$/, "");

  const proto = event.headers?.["x-forwarded-proto"] || "http";
  const host = event.headers?.host || "localhost:8888";
  return `${proto}://${host}`;
}

// ✅ addons 키를 정규화 (additional_revisions -> extra_revisions)
function normalizeAddonKey(k: string): AddonKey | null {
  if (k === "additional_revisions") return "extra_revisions";
  if (
    k === "google_business" ||
    k === "review_request" ||
    k === "copy_refinement" ||
    k === "domain_connection" ||
    k === "extra_revisions"
  ) {
    return k;
  }
  return null;
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

    // ✅ addons 정리: normalize + null 제거 + 중복 제거
    const rawAddons: string[] = Array.isArray(body.addons) ? body.addons : [];
    const addons: AddonKey[] = Array.from(
      new Set(rawAddons.map(normalizeAddonKey).filter(Boolean) as AddonKey[]),
    );

    const siteUrl = getSiteUrl(event);

    // ---- line items 만들기 (base + addons)
    const lineItems: Array<{ name: string; amount: number; qty: number }> = [
      {
        name: "Simple One-Page Website (Service Business)",
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

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set(
      "success_url",
      `${siteUrl}/thank-you?paid=1&template=${encodeURIComponent(
        template,
      )}&theme=${encodeURIComponent(theme)}&addons=${encodeURIComponent(
        addons.join(","),
      )}`,
    );
    params.set("cancel_url", `${siteUrl}/templates`);

    if (ENABLE_AUTOMATIC_TAX) {
      params.set("automatic_tax[enabled]", "true");
    }

    params.set("metadata[template]", template);
    params.set("metadata[theme]", theme);
    params.set("metadata[addons]", addons.join(","));

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
