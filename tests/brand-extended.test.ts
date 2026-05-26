import test from "node:test";
import assert from "node:assert/strict";
import { BRAND } from "../lib/brand.ts";

test("brand identity copy is non-empty", () => {
  assert.ok(BRAND.name.length > 0);
  assert.ok(BRAND.nameAr.length > 0);
  assert.ok(BRAND.tagline.length > 0);
  assert.ok(BRAND.taglineAr.length > 0);
  assert.ok(BRAND.metadataTitle.length > 0);
  assert.ok(BRAND.metadataDescription.length > 0);
  assert.ok(BRAND.footer.length > 0);
});

test("brand identity contains valid Arabic characters", () => {
  const arabicRegex = /[\u0600-\u06FF]/;
  assert.ok(arabicRegex.test(BRAND.nameAr));
  assert.ok(arabicRegex.test(BRAND.taglineAr));
  assert.ok(arabicRegex.test(BRAND.metadataTitle));
  assert.ok(arabicRegex.test(BRAND.metadataDescription));
  assert.ok(arabicRegex.test(BRAND.footer));
});

test("brand design metadata is consistent", () => {
    assert.ok(BRAND.metadataTitle.includes(BRAND.name));
    assert.ok(BRAND.metadataDescription.includes(BRAND.nameAr));
});

test("brand tagline has correct length", () => {
  assert.ok(BRAND.tagline.length > 5);
});
test("brand copyright string format matches", () => {
  assert.ok(BRAND.footer.includes("Nasaq"));
});
