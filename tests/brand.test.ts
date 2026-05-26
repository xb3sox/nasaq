import test from "node:test";
import assert from "node:assert/strict";

import { BRAND } from "../lib/brand.ts";

test("brand identity uses Nasaq as the product name", () => {
  assert.equal(BRAND.name, "Nasaq");
  assert.equal(BRAND.nameAr, "نسق");
  assert.match(BRAND.tagline, /clinic flow/i);
  assert.match(BRAND.taglineAr, /تدفق العيادة/);
  assert.match(BRAND.metadataTitle, /^Nasaq/);
});
