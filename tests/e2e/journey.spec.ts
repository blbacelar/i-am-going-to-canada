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
  await page.getByRole("button", { name: "30 minutes", exact: true }).click();
  const results = page.locator(".concierge-results");
  await expect(results).not.toContainText("Marina Snyder");
  await expect(results).not.toContainText("Virginia Melo");
  await expect(results.locator(".calendly-inline-embed")).toBeVisible();
});

for (const [locale, language, no, durationUnit] of [
  ["en", "English", "No", "minutes"],
  ["fr", "Français", "Non", "minutes"],
  ["es", "Español", "No", "minutos"],
  ["pt", "Português", "Não", "minutos"],
] as const) {
  test(`the ${locale} finder keeps its own interface language`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await page.getByRole("button", { name: language, exact: true }).click();
    const questions = locale === "en"
      ? ["Does this involve a Québec (QC) process?", "Does this involve a Saskatchewan (SK) process?", "Does this involve an appeal, deportation or refugee matter?"]
      : locale === "fr"
        ? ["Le dossier concerne-t-il un processus du Québec (QC)?", "Le dossier concerne-t-il un processus de la Saskatchewan (SK)?", "Le dossier concerne-t-il un appel, une déportation ou une demande d’asile?"]
        : locale === "es"
          ? ["¿Se trata de un proceso de Quebec (QC)?", "¿Se trata de un proceso de Saskatchewan (SK)?", "¿Se trata de una apelación, deportación o solicitud de refugio?"]
          : ["Envolve um processo de Québec (QC)?", "Envolve um processo de Saskatchewan (SK)?", "Envolve recurso, deportação ou refúgio?"];

    for (const question of questions) {
      const group = page.getByRole("group", { name: question });
      await expect(group).toBeVisible();
      await group.getByRole("button", { name: no, exact: true }).click();
    }

    await expect(page.getByRole("button", { name: `30 ${durationUnit}`, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: `60 ${durationUnit}`, exact: true })).toBeVisible();
    await expect(page.locator(".concierge-live")).not.toContainText(locale === "pt" ? "minutes" : "Português");
  });
}

test("language switch preserves a consultant profile route", async ({ page }) => {
  await page.goto("/en/consultants/marina-snyder");
  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "ES" }).click();
  await expect(page).toHaveURL(/\/es\/consultants\/marina-snyder$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("Portuguese remains available in the language switcher", async ({ page }) => {
  await page.goto("/en/consultants/marina-snyder");
  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt\/consultants\/marina-snyder$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
});

test("Spanish header finder goes to the homepage concierge section", async ({ page }) => {
  await page.goto("/es");
  await page.getByRole("banner").getByRole("link", { name: "Encontrar una consultora" }).click();
  await expect(page).toHaveURL(/\/es#find-your-consultant$/);
  await expect(page.locator("#find-your-consultant")).toBeInViewport();
});

test("starting the appointment finder again resets an open booking flow", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByText("Does this involve a Québec (QC) process?")).toBeVisible();

  await page.getByRole("banner").getByRole("link", { name: "Find an appointment" }).click();

  await expect(page.getByRole("button", { name: "English", exact: true })).toBeVisible();
  await expect(page.locator(".calendly-inline-embed")).toHaveCount(0);
});

test("mobile navigation closes after selecting a route", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/es");

  const menu = page.locator(".mobile-navigation");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(menu.locator("summary")).toBeVisible();
  await menu.locator("summary").evaluate((element) => (element as HTMLElement).click());
  await expect(menu).toHaveAttribute("open", "");
  await menu.getByRole("link", { name: "Artículos" }).click();

  await expect(page).toHaveURL(/\/es\/blog$/);
  await expect(page.locator(".mobile-navigation")).not.toHaveAttribute("open", "");
});
