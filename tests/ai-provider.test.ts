import test from "node:test";
import assert from "node:assert/strict";
import { createOpenAiProvider, createGeminiProvider, createDeterministicProvider } from "../lib/ai-provider.ts";

const DENTAL_CLEANING_SLOTS = [
  { label: "اليوم 4:00 مساء", startsAt: "2026-05-22T16:00:00+03:00", doctorName: "د. ريم السيف" },
  { label: "اليوم 7:00 مساء", startsAt: "2026-05-22T19:00:00+03:00", doctorName: "د. ريم السيف" },
];

test("deterministic provider: returns structured decision for booking query", async () => {
  const provider = createDeterministicProvider();
  const result = await provider.analyze("بكم تنظيف الأسنان؟ متاح اليوم؟");
  assert.strictEqual(result.intent, "booking");
  assert.ok(result.confidence >= 0.85);
  assert.strictEqual(result.humanNeeded, false);
  assert.ok(result.reply.includes("250"));
  assert.ok(result.availableSlots?.length === 2);
});

test("deterministic provider: flags medical triage as human needed", async () => {
  const provider = createDeterministicProvider();
  const result = await provider.analyze("أعاني من نزيف شديد في اللثة");
  assert.strictEqual(result.intent, "medical_triage");
  assert.strictEqual(result.humanNeeded, true);
  assert.ok(result.reply.includes("طبيب") || result.reply.includes("طوارئ"));
});

test("deterministic provider: handles cancel intent", async () => {
  const provider = createDeterministicProvider();
  const result = await provider.analyze("أريد إلغاء الموعد");
  assert.strictEqual(result.intent, "cancel");
  assert.strictEqual(result.humanNeeded, false);
});

test("deterministic provider: handles unknown intent with human handoff", async () => {
  const provider = createDeterministicProvider();
  const result = await provider.analyze("شكراً جزيلاً");
  assert.strictEqual(result.humanNeeded, true);
});

test("openai provider: calls fetch with correct body", async () => {
  let capturedBody: unknown = null;
  const mockFetch = async (_url: string, init: RequestInit) => {
    capturedBody = JSON.parse(init.body as string);
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ intent: "booking", confidence: 0.95, humanNeeded: false, reply: "متاح", availableSlots: DENTAL_CLEANING_SLOTS }) } }],
      }),
    };
  };

  const provider = createOpenAiProvider({
    apiKey: "sk-test",
    model: "gpt-4o-mini",
    fetch: mockFetch as unknown as typeof fetch,
  });

  const result = await provider.analyze("أريد حجز موعد");
  assert.strictEqual(result.intent, "booking");
  assert.strictEqual(result.confidence, 0.95);
  assert.ok(capturedBody);
  const body = capturedBody as { messages: unknown[]; response_format: { type: string } };
  assert.ok(Array.isArray(body.messages));
  assert.strictEqual(body.response_format?.type, "json_object");
});

test("gemini provider: calls correct endpoint", async () => {
  let capturedUrl = "";
  const mockFetch = async (url: string) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({ intent: "pricing", confidence: 0.92, humanNeeded: false, reply: "السعر 250 ريال", serviceName: "تنظيف أسنان" }),
            }],
          },
        }],
      }),
    };
  };

  const provider = createGeminiProvider({
    apiKey: "gemini-test",
    model: "gemini-2.0-flash",
    fetch: mockFetch as unknown as typeof fetch,
  });

  const result = await provider.analyze("بكم التنظيف؟");
  assert.strictEqual(result.intent, "pricing");
  assert.ok(capturedUrl.includes("gemini"));
});
