import test from "node:test";
import assert from "node:assert/strict";

import {
  extractLastMessageContent,
  getBoundedString,
  getWhatsAppVerifyToken,
  isUnauthenticatedDemoApiAllowed,
  verifyMetaWebhookSignature,
} from "../lib/api-guards.ts";

test("getBoundedString trims and rejects invalid strings", () => {
  assert.equal(getBoundedString("  hello  "), "hello");
  assert.equal(getBoundedString(""), null);
  assert.equal(getBoundedString("too-long", { max: 3 }), null);
  assert.equal(getBoundedString(123), null);
});

test("extractLastMessageContent validates chat payload shape", () => {
  assert.equal(
    extractLastMessageContent({ messages: [{ content: "السلام" }, { content: "أبغى موعد" }] }),
    "أبغى موعد",
  );
  assert.equal(extractLastMessageContent({ messages: [] }), null);
  assert.equal(extractLastMessageContent({ messages: [{ bad: "shape" }] }), null);
  assert.equal(extractLastMessageContent({ messages: "bad" }), null);
});

test("getWhatsAppVerifyToken allows dev fallback but requires production config", () => {
  assert.equal(getWhatsAppVerifyToken({ NODE_ENV: "development" }), "mock_verify_token");
  assert.equal(getWhatsAppVerifyToken({ NODE_ENV: "production" }), null);
  assert.equal(
    getWhatsAppVerifyToken({
      NODE_ENV: "production",
      WHATSAPP_VERIFY_TOKEN: " real-token ",
    }),
    "real-token",
  );
});

test("isUnauthenticatedDemoApiAllowed blocks production unless explicitly enabled", () => {
  assert.equal(isUnauthenticatedDemoApiAllowed({ NODE_ENV: "development" }), true);
  assert.equal(isUnauthenticatedDemoApiAllowed({ NODE_ENV: "production" }), false);
  assert.equal(
    isUnauthenticatedDemoApiAllowed({
      NODE_ENV: "production",
      ENABLE_UNAUTHENTICATED_DEMO_API: "true",
    }),
    true,
  );
});

test("verifyMetaWebhookSignature validates Meta x-hub-signature-256", async () => {
  const rawBody = JSON.stringify({ object: "whatsapp_business_account" });
  const appSecret = "test-secret";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const signature = `sha256=${Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")}`;

  assert.equal(
    await verifyMetaWebhookSignature({
      rawBody,
      signatureHeader: signature,
      appSecret,
    }),
    true,
  );
  assert.equal(
    await verifyMetaWebhookSignature({
      rawBody,
      signatureHeader: "sha256=bad",
      appSecret,
    }),
    false,
  );
});
