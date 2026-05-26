import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Sidebar component", () => {
  it("exports a default function", () => {
    const filePath = path.join(__dirname, "../components/layout/Sidebar.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    assert.ok(fileContent.includes("export function Sidebar"));
  });

  it("contains expected routes in the file", () => {
    // Read the file since `routes` is not exported
    const filePath = path.join(__dirname, "../components/layout/Sidebar.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const expectedRoutes = [
      "/dashboard",
      "/dashboard/crm",
      "/dashboard/bookings",
      "/dashboard/inbox",
      "/dashboard/reminders",
      "/dashboard/reports",
      "/dashboard/invoices",
      "/dashboard/settings",
    ];

    for (const route of expectedRoutes) {
      assert.ok(fileContent.includes(`href: "${route}"`), `Expected route ${route} to be in the file`);
    }
  });
});
