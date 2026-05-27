## 2026-05-27 - [Timing Attack in Webhook Signature Verification]
**Vulnerability:** The `verifyMetaWebhookSignature` function in `lib/api-guards.ts` used a custom `timingSafeEqual` implementation with a JS loop for bitwise equality comparison, which is susceptible to timing side channels due to V8's JIT optimization.
**Learning:** Manual JS bitwise implementations for timing-safe string comparison do not reliably execute in constant time in modern JS engines.
**Prevention:** Always use Node's native `crypto.timingSafeEqual` from `node:crypto` with Buffers for cryptographic comparisons.
