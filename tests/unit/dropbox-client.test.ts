import { describe, expect, it, vi } from "vitest";
import { getDropboxAccessToken } from "../../src/lib/dropbox/client";

const environment = {
  DROPBOX_APP_KEY: "app-key",
  DROPBOX_APP_SECRET: "app-secret",
  DROPBOX_REFRESH_TOKEN: "refresh-token",
};

describe("Dropbox OAuth client", () => {
  it("exchanges the refresh token for a short-lived access token", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: "short-lived-token" }), { status: 200 })) as typeof fetch;

    await expect(getDropboxAccessToken(environment, fetcher)).resolves.toBe("short-lived-token");
    expect(fetcher).toHaveBeenCalledWith("https://api.dropboxapi.com/oauth2/token", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ "Content-Type": "application/x-www-form-urlencoded" }),
      body: "grant_type=refresh_token&refresh_token=refresh-token",
    }));
  });

  it("does not fall back to an expiring static access token", async () => {
    await expect(getDropboxAccessToken({}, vi.fn())).rejects.toMatchObject({
      message: "Missing DROPBOX_APP_KEY",
    });
  });
});
