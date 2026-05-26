import test from "node:test";
import assert from "node:assert/strict";
import {
  createMockWhatsAppSender,
  createCloudApiWhatsAppSender,
  getWhatsAppSender,
} from "../lib/whatsapp-send.ts";

// ─── Mock sender ──────────────────────────────────────────────────────────────

test("mock sender: returns success with mock message id", async () => {
  const sender = createMockWhatsAppSender();
  const result = await sender.send({ to: "+966501234567", body: "مرحباً" });
  assert.strictEqual(result.ok, true);
  assert.match((result as { ok: true; messageId: string }).messageId, /^mock-/);
});

test("mock sender: returns error when to is empty", async () => {
  const sender = createMockWhatsAppSender();
  const result = await sender.send({ to: "", body: "مرحباً" });
  assert.strictEqual(result.ok, false);
  assert.ok((result as { ok: false; error: string }).error);
});

test("mock sender: returns error when body is empty", async () => {
  const sender = createMockWhatsAppSender();
  const result = await sender.send({ to: "+966501234567", body: "" });
  assert.strictEqual(result.ok, false);
});

// ─── Cloud API sender ─────────────────────────────────────────────────────────

test("cloud sender: calls Meta API with correct payload", async () => {
  let capturedUrl = "";
  let capturedInit: RequestInit = {};

  const fetchFn = async (url: string, init: RequestInit) => {
    capturedUrl = url;
    capturedInit = init;
    return {
      ok: true,
      json: async () => ({ messages: [{ id: "wamid.abc123" }] }),
    };
  };

  const sender = createCloudApiWhatsAppSender({
    phoneNumberId: "123456",
    accessToken: "test-token",
    fetch: fetchFn,
  });

  const result = await sender.send({ to: "+966501234567", body: "تأكيد الموعد" });

  assert.strictEqual(result.ok, true);
  assert.strictEqual((result as { ok: true; messageId: string }).messageId, "wamid.abc123");
  assert.ok(capturedUrl.includes("123456"));
  const body = JSON.parse(capturedInit.body as string);
  assert.strictEqual(body.to, "+966501234567");
  assert.strictEqual(body.text.body, "تأكيد الموعد");
});

test("cloud sender: returns error when Meta API returns non-ok", async () => {
  const fetchFn = async () => ({
    ok: false,
    status: 400,
    json: async () => ({ error: { message: "Invalid phone number" } }),
  });

  const sender = createCloudApiWhatsAppSender({
    phoneNumberId: "123456",
    accessToken: "test-token",
    fetch: fetchFn,
  });

  const result = await sender.send({ to: "+966501234567", body: "تأكيد الموعد" });
  assert.strictEqual(result.ok, false);
  assert.ok((result as { ok: false; error: string }).error.includes("Invalid phone number"));
});

test("cloud sender: returns error on network failure", async () => {
  const fetchFn = async () => {
    throw new Error("Network error");
  };

  const sender = createCloudApiWhatsAppSender({
    phoneNumberId: "123456",
    accessToken: "test-token",
    fetch: fetchFn,
  });

  const result = await sender.send({ to: "+966501234567", body: "مرحباً" });
  assert.strictEqual(result.ok, false);
  assert.ok((result as { ok: false; error: string }).error.includes("Network error"));
});

// ─── getWhatsAppSender factory ────────────────────────────────────────────────

test("getWhatsAppSender: returns mock sender when env is missing", async () => {
  const sender = getWhatsAppSender({});
  const result = await sender.send({ to: "+966501234567", body: "test" });
  assert.strictEqual(result.ok, true);
  assert.match((result as { ok: true; messageId: string }).messageId, /^mock-/);
});

test("getWhatsAppSender: returns Cloud API sender when env is present", () => {
  const sender = getWhatsAppSender({
    WHATSAPP_PHONE_NUMBER_ID: "999",
    WHATSAPP_ACCESS_TOKEN: "tok",
  });
  assert.ok(sender);
  assert.strictEqual(typeof sender.send, "function");
});
