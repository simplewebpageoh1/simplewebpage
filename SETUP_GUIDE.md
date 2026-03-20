
# First Customer Setup Guide (Internal)

## Step 1. Purchase
- Customer buys $99 one-page template

## Step 2. Collect Info (Form or Email)
Ask for:
- Business name
- Industry
- City / Service area
- Phone number
- Email
- Short service list (3–6 items)

## Step 3. Apply Template
- Copy matching template
- Replace text only (no layout change)
- Insert business name + city into title/description

## Step 4. Preview
- Deploy to Netlify preview link
- Send link to customer

## Step 5. Go Live
- Help connect domain (or send PDF guide)
- Final deploy

Time per customer:
- Content edit: 20–30 min
- Deploy & check: 10 min
Total: ~40 minutes

---

# Lead automation (Contact form → Email + Google Sheets)

This project supports **full-control lead handling**:

1) Customer submits the **Contact** form (Netlify Forms).
2) Netlify Forms triggers a **Webhook**.
3) The webhook calls `/.netlify/functions/contact-lead`.
4) The function:
   - sends an **owner notification email**
   - optionally sends a **customer auto-reply**
   - appends the lead to **Google Sheets**

## A) Create the Google Sheet

1. Create a Google Sheet (example tab name: `Leads`).
2. Add columns (recommended):
   - `submitted_at`, `name`, `email`, `industry`, `template`, `theme`, `message`, `selection_summary`
3. Copy the Spreadsheet ID from the URL.

## B) Create a Google Service Account

1. Google Cloud Console → create/select a project.
2. Enable **Google Sheets API**.
3. Create a **Service Account**.
4. Create a **Key** (JSON) for that service account.
5. Share the Google Sheet with the service account email (Editor permission).

Set Netlify environment variables:

- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_RANGE` (default: `Leads!A1`)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (paste the private_key value; replace newlines with `\n`)

## C) SendGrid email (owner + auto-reply)

1. Create a SendGrid API key.
2. Set environment variables:
   - `SENDGRID_API_KEY`
   - `LEAD_OWNER_EMAIL` (example: `info@simplewebpageoh.com`)
   - `EMAIL_FROM` (must be a verified sender in SendGrid)
   - `ENABLE_LEAD_AUTOREPLY` (`true` / `false`)

## D) Configure the Netlify Forms Webhook

Netlify Dashboard → Site → **Forms** → select form `contact` → **Settings & Usage**:

1. Add a webhook notification.
2. Webhook URL:
   - Production: `https://<your-site>.netlify.app/.netlify/functions/contact-lead`
   - Local (netlify dev): `http://localhost:8888/.netlify/functions/contact-lead`
3. Save.

## E) Quick test (manual)

You can POST a test lead manually:

```bash
curl -X POST https://<your-site>.netlify.app/.netlify/functions/contact-lead \
  -H "Content-Type: application/json" \
  -d '{"data":{"name":"Test","email":"test@example.com","message":"Hello","industry":"Electrician","template":"electrician","theme":"B"}}'
```

