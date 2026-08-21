import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const articles = {
  en: {
    slug: "express-entry-three-rounds-crs-cutoffs-explained",
    title: "Why Express Entry cut-off scores were 760, 523 and 382 in the same week",
    targetLocale: "fr",
    targetSlug: "entree-express-trois-rondes-seuils-scg-expliques",
  },
  fr: {
    slug: "ptet-limite-postes-bas-salaire-petits-lieux-travail",
    title: "PTET : comment fonctionne le calcul de la limite des postes à bas salaire dans les lieux de travail comptant moins de 10 employés",
    targetLocale: "pt",
    targetSlug: "tfwp-limite-vagas-baixa-remuneracao-locais-pequenos",
  },
  pt: {
    slug: "ilha-principe-eduardo-consulta-trabalhadores-estrangeiros-temporarios",
    title: "Ilha do Príncipe Eduardo propõe registro de empregadores e sanções para proteger trabalhadores estrangeiros temporários",
    targetLocale: "en",
    targetSlug: "pei-temporary-foreign-worker-regulations-consultation",
  },
} as const;

for (const locale of ["en", "fr", "pt"] as const) {
  test(`${locale} blog renders localized articles and structured data`, async ({ page }) => {
    const article = articles[locale];
    await page.goto(`/${locale}/blog`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".blog-feed-item")).toHaveCount(3);
    await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /index/);
    await expect(page.getByText("ready_for_human_review")).toHaveCount(0);

    await page.goto(`/${locale}/blog/${article.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(article.title);
    await expect(page.getByText("ready_for_human_review")).toHaveCount(0);
    await expect(page.locator(".article-source-list a")).not.toHaveCount(0);
    await expect(page.locator("script[type='application/ld+json']")).toHaveCount(1);

    const jsonLd = await page.locator("script[type='application/ld+json']").textContent();
    expect(jsonLd).toContain(locale === "en" ? "en-CA" : locale === "fr" ? "fr-CA" : "pt-BR");
    expect(jsonLd).toContain("datePublished");

    await expect(page.locator(`.language-switcher a[lang='${article.targetLocale}']`)).toHaveAttribute(
      "href",
      `/${article.targetLocale}/blog/${article.targetSlug}`,
    );
  });
}

test("blog article has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/pt/blog/express-entry-tres-rodadas-cortes-crs-explicados");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

for (const width of [375, 768, 1440]) {
  test(`blog pages have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/fr/blog");
    const indexWidth = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(indexWidth[0]).toBeLessThanOrEqual(indexWidth[1]);

    await page.goto("/fr/blog/ile-du-prince-edouard-consultation-travailleurs-etrangers-temporaires");
    const articleWidth = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(articleWidth[0]).toBeLessThanOrEqual(articleWidth[1]);
  });
}
