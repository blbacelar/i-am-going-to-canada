const DROPBOX_OAUTH_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
type FetchLike = typeof fetch;
type Environment = Record<string, string | undefined>;

type DropboxTokenResponse = {
  access_token?: string;
};

export class DropboxRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "DropboxRequestError";
  }
}

function required(value: string | undefined, name: string) {
  if (!value) throw new DropboxRequestError(`Missing ${name}`);
  return value;
}

/**
 * Exchanges the durable OAuth refresh token for a short-lived access token.
 * The credentials remain server-only environment variables and are never sent
 * to the browser or persisted in source control.
 */
export async function getDropboxAccessToken(environment: Environment = process.env, fetcher: FetchLike = fetch) {
  const appKey = required(environment.DROPBOX_APP_KEY, "DROPBOX_APP_KEY");
  const appSecret = required(environment.DROPBOX_APP_SECRET, "DROPBOX_APP_SECRET");
  const refreshToken = required(environment.DROPBOX_REFRESH_TOKEN, "DROPBOX_REFRESH_TOKEN");
  const basicAuth = Buffer.from(`${appKey}:${appSecret}`).toString("base64");

  const response = await fetcher(DROPBOX_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }).toString(),
  });

  if (!response.ok) throw new DropboxRequestError("Dropbox token refresh failed", response.status);
  const body = await response.json().catch(() => null) as DropboxTokenResponse | null;
  if (!body?.access_token) throw new DropboxRequestError("Dropbox token refresh returned no access token");
  return body.access_token;
}
