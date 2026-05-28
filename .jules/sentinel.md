
## 2025-02-21 - [Timing Attack Vulnerability in Webhook Verification]
**Vulnerability:** The `timingSafeEqual` function in `lib/api-guards.ts` had a length check `if (aBuf.length !== bBuf.length) return false;` which would early return, allowing for a timing attack on the length of the string compared.
**Learning:** Comparing varying-length inputs using timing safe methods without hashing opens up a vulnerability where an attacker could deduce the expected string's length based on response times since length mismatches short-circuit the execution.
**Prevention:** Always normalize the lengths of inputs to a constant size (e.g. using SHA-256) before passing them to a timing safe comparison method like `cryptoNode.timingSafeEqual` to avoid these timing leaks.
