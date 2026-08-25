import { expect, test } from "@playwright/test";

test("localized home, concierge and booking handoff work", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("bonne conversation");

  await page.getByRole("link", { name: "Trouver ma consultante" }).click();
  await page.getByRole("button", { name: /Français/ }).click();
  await page.getByRole("button", { name: "Non", exact: true }).click();
  await page.getByRole("button", { name: "Non", exact: true }).click();
  await page.getByRole("button", { name: "Non", exact: true }).click();
  const results = page.locator(".concierge-results");
  await expect(results.getByRole("heading", { name: "Marina Snyder" })).toBeVisible();
  await expect(results.getByRole("heading", { name: "Virginia Melo" })).toBeVisible();
  await expect(results.getByRole("link", { name: "Voir les disponibilités" }).first()).toHaveAttribute("href", /calendly\.com/);
});

test("language switch preserves a consultant profile route", async ({ page }) => {
  await page.goto("/en/consultants/marina-snyder");
  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt\/consultants\/marina-snyder$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
});

test("mobile navigation closes after selecting a route", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/pt");

  const menu = page.locator(".mobile-navigation");
  await menu.getByText("Menu", { exact: true }).click();
  await expect(menu).toHaveAttribute("open", "");
  await menu.getByRole("link", { name: "Artigos" }).click();

  await expect(page).toHaveURL(/\/pt\/blog$/);
  await expect(page.locator(".mobile-navigation")).not.toHaveAttribute("open", "");
});
