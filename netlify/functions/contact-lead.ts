// Netlify Function: Handle Contact leads (notify + log to Google Sheets)
// - Triggered by Netlify Forms webhook (recommended) OR manual POST.
// - No external npm deps: uses fetch + node:crypto to create Google OAuth JWT.

import type { Handler } from "@netlify/functions";
import crypto from "node:crypto";

type Lead = {
  name?: string;
  email?: string;
  message?: string;
  industry?: string;
  template?: string;
  theme?: string;
  selectionSummary?: string;
};

function nowIso() {
  return new Date().toISOString();
}

function b64url(input: string | Buffer) {
  const base64 = Buffer.from(input).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function signJwtRS256(payload: Record<string, any>, privateKeyPem: string) {
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = b64url(JSON.stringify(header));
  const encodedPayload = b64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKeyPem);
  return `${data}.${b64url(signature)}`;
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKeyRaw) return null;

  // Netlify env vars often store newlines as \n
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const jwt = signJwtRS256(
    {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat,
      exp,
    },
    privateKey,
  );

  const body = new URLSearchParams();
  body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.set("assertion", jwt);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await res.json()) as any;
  if (!res.ok) return null;
  return String(json.access_token || "");
}

async function appendLeadToSheet(lead: Lead) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const range = process.env.GOOGLE_SHEETS_RANGE || "Leads!A1";
  if (!spreadsheetId) return { ok: false as const, reason: "Missing GOOGLE_SHEETS_SPREADSHEET_ID" };

  const token = await getGoogleAccessToken();
  if (!token) return { ok: false as const, reason: "Missing/invalid Google service account env vars" };

  const values = [
    [
      nowIso(),
      lead.name || "",
      lead.email || "",
      lead.industry || "",
      lead.template || "",
      lead.theme || "",
      lead.message || "",
      lead.selectionSummary || "",
    ],
  ];

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId,
    )}/values/${encodeURIComponent(range)}:append`,
  );
  url.searchParams.set("valueInputOption", "USER_ENTERED");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    const t = await res.text();
    return { ok: false as const, reason: `Sheets API error: ${t.slice(0, 300)}` };
  }

  return { ok: true as const };
}

async function sendSendGridEmail(args: {
  to: string;
  from: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return { ok: false as const, reason: "Missing SENDGRID_API_KEY" };

  const payload: any = {
    personalizations: [{ to: [{ email: args.to }] }],
    from: { email: args.from },
    subject: args.subject,
    content: [{ type: "text/plain", value: args.text }],
  };
  if (args.replyTo) payload.reply_to = { email: args.replyTo };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text();
    return { ok: false as const, reason: `SendGrid error: ${t.slice(0, 300)}` };
  }
  return { ok: true as const };
}

function parseLead(body: any): Lead {
  // Netlify Forms webhook payloads vary by version.
  // Handle common shapes:
  // - { payload: { data: { ...fields } } }
  // - { data: { ...fields } }
  // - { ...fields }
  const data = body?.payload?.data || body?.data || body || {};

  return {
    name: data.name,
    email: data.email,
    message: data.message,
    industry: data.industry,
    template: data.template,
    theme: data.theme,
    selectionSummary: data.selectionSummary,
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let parsed: any = {};
  try {
    parsed = JSON.parse(event.body || "{}");
  } catch {
    parsed = {};
  }

  const lead = parseLead(parsed);

  // 1) Append to Google Sheets (if configured)
  const sheetResult = await appendLeadToSheet(lead);

  // 2) Email notifications (if configured)
  const ownerEmail = process.env.LEAD_OWNER_EMAIL || "";
  const fromEmail = process.env.EMAIL_FROM || ownerEmail;
  const replyTo = ownerEmail || undefined;

  const notifyResults: any[] = [];

  if (ownerEmail && fromEmail) {
    const ownerText = [
      `New lead received (${nowIso()})`,
      "",
      `Name: ${lead.name || ""}`,
      `Email: ${lead.email || ""}`,
      `Industry: ${lead.industry || ""}`,
      `Template: ${lead.template || ""}`,
      `Theme: ${lead.theme || ""}`,
      "",
      "Message:",
      lead.message || "",
      "",
      "Selection summary:",
      lead.selectionSummary || "",
    ].join("\n");

    notifyResults.push(
      await sendSendGridEmail({
        to: ownerEmail,
        from: fromEmail,
        subject: `New website lead: ${lead.industry || lead.template || ""}`.trim(),
        text: ownerText,
        replyTo: lead.email || replyTo,
      }),
    );
  }

  // Auto-reply to customer
  const autoReplyEnabled = (process.env.ENABLE_LEAD_AUTOREPLY || "true").toLowerCase() === "true";
  if (autoReplyEnabled && lead.email && fromEmail) {
    const customerText = [
      `Hi ${lead.name || "there"},`,
      "",
      "Thanks for reaching out. We received your message and we’ll reply within 24 hours.",
      "",
      "If you’re ready to proceed, you can return to checkout from the Templates page.",
      "",
      "— SimpleWebPageOH",
    ].join("\n");

    notifyResults.push(
      await sendSendGridEmail({
        to: lead.email,
        from: fromEmail,
        subject: "We received your message — SimpleWebPageOH",
        text: customerText,
        replyTo,
      }),
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      sheet: sheetResult,
      emails: notifyResults,
    }),
  };
};
