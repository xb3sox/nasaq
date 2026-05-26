import { describe, it } from "node:test";
import assert from "node:assert";

import { useSetupStore } from "../lib/setup-store.ts";

describe("SetupStore", () => {
  it("exports useSetupStore function", () => {
    assert.strictEqual(typeof useSetupStore, "function");
  });

  it("can be imported without crashing", () => {
    assert.ok(useSetupStore);
  });
});
