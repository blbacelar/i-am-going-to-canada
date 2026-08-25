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
  await expect(results).not.toContainText("Marina Snyder");
  await expect(results).not.toContainText("Virginia Melo");
  await expect(results.getByRole("link", { name: "Continuer vers la réservation" })).toHaveAttribute("href", /calendly\.com/);
});

test("language switch preserves a consultant profile route", async ({ page }) => {
  await page.goto("/en/consultants/marina-snyder");
  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt\/consultants\/marina-snyder$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
});

test("Portuguese header finder goes to the homepage concierge section", async ({ page }) => {
  await page.goto("/pt");
  await page.getByRole("banner").getByRole("link", { name: "Encontrar uma consultora" }).click();
  await expect(page).toHaveURL(/\/pt#find-your-consultant$/);
  await expect(page.locator("#find-your-consultant")).toBeInViewport();
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
