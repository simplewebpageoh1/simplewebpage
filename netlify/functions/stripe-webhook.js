// netlify/functions/stripe-webhook.js
// ✅ Stripe Webhook (JS 유지 + 라이브 안정화 강화버전)
// - base64 body 대응 (Netlify에서 종종 필요)
// - 헤더 대소문자/배열 방어
// - timestamp tolerance(리플레이 공격 방지)
// - timing-safe hex 비교
//
// Netlify Env 필요:
// STRIPE_WEBHOOK_SECRET=whsec_...

import crypto from "crypto";

const TOLERANCE_SEC = 300; // 5 minutes

export const handler = async (event) => {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return { statusCode: 500, body: "Missing STRIPE_WEBHOOK_SECRET" };
    }

    // ✅ Header 방어 (대소문자 + 배열)
    let sig =
      event.headers?.["stripe-signature"] ||
      event.headers?.["Stripe-Signature"] ||
      event.headers?.["STRIPE-SIGNATURE"];

    if (!sig) {
      return { statusCode: 400, body: "Missing stripe-signature header" };
    }
    if (Array.isArray(sig)) sig = sig[0];

    // ✅ Raw body (base64 인코딩 가능성 대응)
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "";

    if (!rawBody) {
      return { statusCode: 400, body: "Missing body" };
    }

    // ✅ Signature verify
    const verified = verifyStripeSignature(rawBody, sig, secret, TOLERANCE_SEC);
    if (!verified) {
      return { statusCode: 400, body: "Invalid signature" };
    }

    // ✅ Parse JSON
    const evt = JSON.parse(rawBody);

    // ✅ 필요한 이벤트만 처리
    if (evt?.type === "checkout.session.completed") {
      const session = evt.data?.object;

      // TODO(운영 강화):
      // 1) 멱등 처리(중복 webhook 방지): evt.id 저장 후 이미 처리했으면 skip
      // 2) 주문/고객 정보:
      //    - session.id
      //    - session.customer_details?.email
      //    - session.metadata?.plan / template / addons
      // 3) 이메일 발송/DB 저장 등
      //
      // ⚠️ 지금 단계에서는 안정화 우선이라 "처리 로직 최소" 권장
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    // 로그가 필요하면 아래 콘솔 추가 가능 (Netlify Functions 로그에서 확인)
    // console.error("stripe-webhook error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};

function verifyStripeSignature(payload, signatureHeader, secret, toleranceSec) {
  // stripe-signature 예: "t=1700000000,v1=abc...,v0=..."
  const parts = signatureHeader.split(",").reduce((acc, p) => {
    const [k, v] = p.split("=");
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});

  const t = parts.t;
  const v1 = parts.v1;

  if (!t || !v1) return false;

  // ✅ timestamp tolerance (리플레이 공격 방지)
  const now = Math.floor(Date.now() / 1000);
  const tNum = Number(t);
  if (!Number.isFinite(tNum)) return false;

  if (toleranceSec && Math.abs(now - tNum) > toleranceSec) {
    return false;
  }

  // ✅ signed payload = `${t}.${payload}`
  const signedPayload = `${t}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return timingSafeEqualHex(expected, v1);
}

function timingSafeEqualHex(aHex, bHex) {
  try {
    const aBuf = Buffer.from(aHex, "hex");
    const bBuf = Buffer.from(bHex, "hex");
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}
