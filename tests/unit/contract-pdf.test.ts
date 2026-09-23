import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createContractPdf } from "@/app/api/test/mock-booking/route";

const brandDirectory = path.resolve(import.meta.dirname, "../../public/brand");

afterEach(() => vi.unstubAllGlobals());

describe("contract PDF generation", () => {
  it("loads branded assets over the deployment origin instead of the server filesystem", async () => {
    const assets = new Map([
      ["https://contract-test.example/brand/marina-ms-logo.png", await readFile(path.join(brandDirectory, "marina-ms-logo.png"))],
      ["https://contract-test.example/brand/marina-signature.jpeg", await readFile(path.join(brandDirectory, "marina-signature.jpeg"))],
    ]);
    const fetchMock = vi.fn(async (input: URL | RequestInfo) => {
      const asset = assets.get(String(input));
      return asset ? new Response(new Uint8Array(asset)) : new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const contract = await createContractPdf(
      { name: "Test Client", email: "client@example.com", addressAndPhone: "123 Test Street", preparationNotes: "", fee: "TEST" },
      "Marina Snyder",
      "R519265",
      "Test contact",
      "en",
      "https://contract-test.example",
    );

    expect(contract.pdf.subarray(0, 4).toString()).toBe("%PDF");
    expect(contract.signatureFields).toHaveLength(2);
    expect(fetchMock.mock.calls.map(([input]) => String(input))).toEqual([
      "https://contract-test.example/brand/marina-ms-logo.png",
      "https://contract-test.example/brand/marina-signature.jpeg",
    ]);
  });
});
