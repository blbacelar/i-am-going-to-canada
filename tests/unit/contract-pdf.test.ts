import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createContractPdf, wrapContractText } from "@/app/api/test/mock-booking/route";

const brandDirectory = path.resolve(import.meta.dirname, "../../public/brand");

afterEach(() => vi.unstubAllGlobals());

describe("contract PDF generation", () => {
  it("wraps contact details at whitespace and keeps an email address whole", () => {
    const email = "lagoramosnutricionista@gmail.com";
    const lines = wrapContractText(`Email: ${email}`, 15, (value) => value.length);

    expect(lines).toEqual(["Email:", email]);
    expect(lines.join(" ")).toContain(email);
    expect(lines).not.toContain("lagoramosnutricionista@");
  });

  it("loads branded assets over the deployment origin instead of the server filesystem", async () => {
    const assets = new Map([
      ["https://contract-test.example/brand/marina-ms-logo.png", await readFile(path.join(brandDirectory, "marina-ms-logo.png"))],
      ["https://contract-test.example/brand/marina-signature-transparent.png", await readFile(path.join(brandDirectory, "marina-signature-transparent.png"))],
    ]);
    const fetchMock = vi.fn(async (input: URL | RequestInfo) => {
      const asset = assets.get(String(input));
      return asset ? new Response(new Uint8Array(asset)) : new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const contract = await createContractPdf(
      { name: "Test Client", email: "client@example.com", addressAndPhone: "123 Test Street", preparationNotes: "", fee: "TEST" },
      { id: "marina-snyder", name: "Marina Snyder", credentialLabel: "RCIC-IRB", credentialValue: "R519265", contact: "Test contact", signatureAssetPath: "/brand/marina-signature-transparent.png" },
      "en",
      "https://contract-test.example",
    );

    expect(contract.pdf.subarray(0, 4).toString()).toBe("%PDF");
    expect(contract.signatureFields).toHaveLength(2);
    expect(fetchMock.mock.calls.map(([input]) => String(input))).toEqual([
      "https://contract-test.example/brand/marina-ms-logo.png",
      "https://contract-test.example/brand/marina-signature-transparent.png",
    ]);
  });
});
