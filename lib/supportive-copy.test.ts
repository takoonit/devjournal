import { test } from "node:test";
import assert from "node:assert";
import { resolveSupportiveToastCopy } from "./supportive-copy.ts";

test("resolveSupportiveToastCopy - rewardIntensity: 'off'", async (t) => {
  await t.test("should return generic 'Success' title and fallback message", () => {
    const result = resolveSupportiveToastCopy({
      type: "success",
      rewardIntensity: "off",
      fallbackMessage: "Successfully saved!",
    });
    assert.deepStrictEqual(result, {
      title: "Success",
      message: "Successfully saved!",
    });
  });

  await t.test("should return generic 'Error' title and fallback message", () => {
    const result = resolveSupportiveToastCopy({
      type: "error",
      rewardIntensity: "off",
      fallbackMessage: "Something went wrong",
    });
    assert.deepStrictEqual(result, {
      title: "Error",
      message: "Something went wrong",
    });
  });

  await t.test("should return generic 'Update' title for 'info' type", () => {
    const result = resolveSupportiveToastCopy({
      type: "info",
      rewardIntensity: "off",
      fallbackMessage: "Entry updated",
    });
    assert.deepStrictEqual(result, {
      title: "Update",
      message: "Entry updated",
    });
  });
});

test("resolveSupportiveToastCopy - rewardIntensity: 'subtle'", async (t) => {
  await t.test("should return supportive title and fallback for generic success", () => {
    const result = resolveSupportiveToastCopy({
      type: "success",
      rewardIntensity: "subtle",
      fallbackMessage: "Done!",
      copyKey: "generic",
    });
    assert.deepStrictEqual(result, {
      title: "Nice momentum",
      message: "Done!",
      emphasis: undefined,
    });
  });

  await t.test("should return supportive title and keyed message for success", () => {
    const result = resolveSupportiveToastCopy({
      type: "success",
      rewardIntensity: "subtle",
      fallbackMessage: "Imported!",
      copyKey: "import-success",
    });
    assert.deepStrictEqual(result, {
      title: "Nice momentum",
      message: "Your data is safely back in the flow.",
      emphasis: undefined,
    });
  });

  await t.test("should return supportive title and fallback for error", () => {
    const result = resolveSupportiveToastCopy({
      type: "error",
      rewardIntensity: "subtle",
      fallbackMessage: "Failed",
    });
    assert.deepStrictEqual(result, {
      title: "Quick reset",
      message: "Failed",
      emphasis: undefined,
    });
  });
});

test("resolveSupportiveToastCopy - rewardIntensity: 'full'", async (t) => {
  await t.test("should return full intensity title, keyed message, and emphasis for success", () => {
    const result = resolveSupportiveToastCopy({
      type: "success",
      rewardIntensity: "full",
      fallbackMessage: "Project created",
      copyKey: "generic",
    });
    assert.deepStrictEqual(result, {
      title: "Great work",
      message: "Project created",
      emphasis: "Keep building.",
    });
  });

  await t.test("should return full intensity title for error without emphasis", () => {
    const result = resolveSupportiveToastCopy({
      type: "error",
      rewardIntensity: "full",
      fallbackMessage: "Save failed",
    });
    assert.deepStrictEqual(result, {
      title: "Still on track",
      message: "Save failed",
      emphasis: undefined,
    });
  });

  await t.test("should return full intensity title for info", () => {
    const result = resolveSupportiveToastCopy({
      type: "info",
      rewardIntensity: "full",
      fallbackMessage: "Entry public",
      copyKey: "entry-public",
    });
    assert.deepStrictEqual(result, {
      title: "Progress update",
      message: "This entry is now visible on your portfolio.",
      emphasis: undefined,
    });
  });
});

test("resolveSupportiveToastCopy - fallbacks", async (t) => {
  await t.test("should fallback to provided message if keyed message doesn't exist for the type", () => {
    const result = resolveSupportiveToastCopy({
      type: "error",
      rewardIntensity: "subtle",
      fallbackMessage: "Actually an error",
      copyKey: "entry-public", // entry-public only has 'info' copy
    });
    assert.strictEqual(result.message, "Actually an error");
  });
});
