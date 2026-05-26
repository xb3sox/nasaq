import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("PWARegistry component", () => {
  it("exports PWARegistry function", () => {
    const filePath = path.join(__dirname, "../components/pwa-registry.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    assert.ok(fileContent.includes("export function PWARegistry"));
  });
});
