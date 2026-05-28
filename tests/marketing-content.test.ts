import test from "node:test";
import assert from "node:assert/strict";
import { FEATURES, HOW_IT_WORKS, PRICING } from "../features/marketing/content.ts";

test("FEATURES array is valid", () => {
  assert.ok(Array.isArray(FEATURES));
  assert.ok(FEATURES.length > 0);
  FEATURES.forEach(feature => {
    assert.ok(typeof feature === "string");
  });
});

test("HOW_IT_WORKS array is valid", () => {
  assert.ok(Array.isArray(HOW_IT_WORKS));
  assert.ok(HOW_IT_WORKS.length > 0);
  HOW_IT_WORKS.forEach(step => {
    assert.ok(typeof step === "string");
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
  });
});
