// netlify/functions/send-contact.js
export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const SENDGRID_FROM = process.env.SENDGRID_FROM;

    if (!SENDGRID_API_KEY || !ADMIN_EMAIL || !SENDGRID_FROM) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "Missing env vars: SENDGRID_API_KEY / ADMIN_EMAIL / SENDGRID_FROM",
        }),
      };
    }

    const { name, email, message, theme, template, addons, page } = JSON.parse(
      event.body || "{}",
    );

    const html = `
      <h2>New Contact Lead</h2>
      <p><b>Name:</b> ${escapeHtml(name || "")}</p>
      <p><b>Email:</b> ${escapeHtml(email || "")}</p>
      <p><b>Template:</b> ${escapeHtml(template || "")}</p>
      <p><b>Theme:</b> ${escapeHtml(theme || "")}</p>
      <p><b>Add-ons:</b> ${escapeHtml((addons || []).join(", "))}</p>
      <p><b>Page:</b> ${escapeHtml(page || "")}</p>
      <hr/>
      <p><b>Message:</b><br/>${escapeHtml(message || "").replaceAll(
        "\n",
        "<br/>",
      )}</p>
    `;

    const payload = {
      personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
      from: { email: SENDGRID_FROM },
      reply_to: email ? { email } : undefined,
      subject: `New Contact Lead`,
      content: [{ type: "text/html", value: html }],
    };

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // SendGrid는 성공 시 보통 202 반환
    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "SendGrid failed", details: text }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Email failed", details: String(err) }),
    };
  }
};

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
