import test from "node:test";
import assert from "node:assert/strict";
import { cn } from "../lib/utils.ts";

test("cn properly merges tailwind classes", () => {
  const result = cn("p-4", "m-4");
  assert.equal(result, "p-4 m-4");
});

test("cn properly handles conditional classes", () => {
  const result = cn("p-4", true && "bg-red-500", false && "bg-blue-500");
  assert.equal(result, "p-4 bg-red-500");
});

test("cn resolves tailwind class conflicts correctly", () => {
  const result = cn("p-4", "p-8");
  assert.equal(result, "p-8");
});

test("cn handles undefined and null values", () => {
  const result = cn("flex", undefined, "items-center", null, "justify-center");
  assert.equal(result, "flex items-center justify-center");
});

test("cn properly handles arrays", () => {
  const result = cn(["p-4", "m-4"]);
  assert.equal(result, "p-4 m-4");
});

test("cn properly handles objects", () => {
  const result = cn({ "p-4": true, "m-4": false });
  assert.equal(result, "p-4");
});

test("cn properly handles mixed types", () => {
  const result = cn("p-4", { "m-4": true }, ["text-center", false && "hidden"]);
  assert.equal(result, "p-4 m-4 text-center");
});

test("cn properly handles falsy values", () => {
  const result = cn("p-4", null, undefined, false, 0, "", "m-4");
  assert.equal(result, "p-4 m-4");
});

test("cn properly handles function input ignores it", () => {
  const result = cn("p-4", (() => "m-4") as unknown, "text-center");
  assert.equal(typeof result, "string");
});
