## 2026-05-27 - [Timing Attack in Webhook Signature Verification]
**Vulnerability:** The `verifyMetaWebhookSignature` function in `lib/api-guards.ts` used a custom `timingSafeEqual` implementation with a JS loop for bitwise equality comparison, which is susceptible to timing side channels due to V8's JIT optimization.
**Learning:** Manual JS bitwise implementations for timing-safe string comparison do not reliably execute in constant time in modern JS engines.
**Prevention:** Always use Node's native `crypto.timingSafeEqual` from `node:crypto` with Buffers for cryptographic comparisons.

## 2026-05-29 - [Length-Based Timing Attack in Webhook Signature Verification]
**Vulnerability:** The `timingSafeEqual` function in `lib/api-guards.ts` included an early return if the input string lengths did not match, allowing an attacker to incrementally guess the signature length.
**Learning:** While `crypto.timingSafeEqual` performs a constant-time comparison, performing a length check before calling it exposes a length-based timing attack.
**Prevention:** Always hash inputs (e.g., using SHA-256) to ensure consistent lengths before calling `crypto.timingSafeEqual` when comparing potentially variable-length strings like signatures.
