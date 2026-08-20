import { test } from "@playwright/test";

const reviewDir = ".impeccable/review";

const captures = [
  { locale: "en", width: 375, height: 812, name: "mobile.png" },
  { locale: "en", width: 768, height: 1024, name: "tablet-768.png" },
  { locale: "en", width: 1024, height: 900, name: "desktop-1024.png" },
  { locale: "en", width: 1440, height: 1000, name: "desktop.png" },
  { locale: "fr", width: 375, height: 812, name: "fr-mobile.png" },
  { locale: "fr", width: 1440, height: 1000, name: "fr-desktop.png" },
  { locale: "pt", width: 375, height: 812, name: "pt-mobile.png" },
  { locale: "pt", width: 1440, height: 1000, name: "pt-desktop.png" },
] as const;

for (const capture of captures) {
  test(`capture ${capture.locale} at ${capture.width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: capture.width, height: capture.height });
    await page.goto(`/${capture.locale}`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      for (let position = 0; position < document.body.scrollHeight; position += window.innerHeight) {
        window.scrollTo(0, position);
        await new Promise((resolve) => window.setTimeout(resolve, 24));
      }
      window.scrollTo(0, 0);
    });
    await page.screenshot({ path: `${reviewDir}/${capture.name}`, fullPage: true });
  });
}
