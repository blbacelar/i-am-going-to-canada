import { expect, test } from "@playwright/test";

test("localized home, concierge and booking handoff work", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("bonne conversation");

  await page.getByRole("link", { name: "Trouver ma consultante" }).click();
  await page.getByRole("button", { name: /Français/ }).click();
  await page.getByRole("button", { name: /Résidence permanente/ }).click();
  const results = page.locator(".concierge-results");
  await expect(results.getByRole("heading", { name: "Marina Snyder" })).toBeVisible();
  await expect(results.getByRole("heading", { name: "Virginia Melo" })).toBeVisible();
});

test("language switch preserves a consultant profile route", async ({ page }) => {
  await page.goto("/en/consultants/marina-snyder");
  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt\/consultants\/marina-snyder$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
});
