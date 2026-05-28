import test from "node:test";
import assert from "node:assert/strict";
import { FEATURES, PRICING, FAQS } from "../features/marketing/content.ts";

test("FEATURES array is valid", () => {
  assert.ok(Array.isArray(FEATURES));
  assert.ok(FEATURES.length > 0);
  FEATURES.forEach(feature => {
    assert.ok(typeof feature.iconKey === "string");
    assert.ok(typeof feature.title === "string");
    assert.ok(typeof feature.desc === "string");
  });
});

test("PRICING array is valid", () => {
  assert.ok(Array.isArray(PRICING));
  assert.ok(PRICING.length > 0);
  PRICING.forEach(plan => {
    assert.ok(typeof plan.name === "string");
    assert.ok(typeof plan.setup === "string");
    assert.ok(typeof plan.monthly === "string");
    assert.ok(Array.isArray(plan.features));
    assert.ok(typeof plan.highlight === "boolean");
  });
});

test("FAQS array is valid", () => {
  assert.ok(Array.isArray(FAQS));
  assert.ok(FAQS.length > 0);
  FAQS.forEach(faq => {
    assert.ok(typeof faq.q === "string");
    assert.ok(typeof faq.a === "string");
  });
});
