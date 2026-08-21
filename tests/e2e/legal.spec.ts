import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const legalHeadings = {
  en: { privacy: "Privacy policy", disclaimer: "Website disclaimer" },
  fr: { privacy: "Politique de confidentialité", disclaimer: "Avis concernant le site" },
  pt: { privacy: "Política de privacidade", disclaimer: "Aviso legal" },
} as const;

for (const locale of ["en", "fr", "pt"] as const) {
  test(`${locale} legal pages render complete localized content`, async ({ page }) => {
    await page.goto(`/${locale}/privacy`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(legalHeadings[locale].privacy);
    await expect(page.locator(".legal-section")).toHaveCount(6);
    await expect(page.locator('a[href="mailto:info@iamgoingtocanada.ca"]')).toBeVisible();

    await page.goto(`/${locale}/disclaimer`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(legalHeadings[locale].disclaimer);
    await expect(page.locator(".legal-section")).toHaveCount(6);
    await expect(page.locator('a[href*="canada.ca"]')).toBeVisible();
  });
}

for (const path of ["privacy", "disclaimer"] as const) {
  test(`${path} page has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(`/pt/${path}`);
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test(`${path} page has no horizontal overflow on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(`/pt/${path}`);

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });
}
