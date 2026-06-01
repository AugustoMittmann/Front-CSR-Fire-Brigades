// Auth0 SPA configuration. Domain and clientId are public values for SPA flows
// but we still source them from env vars so per-environment configs are
// straightforward and nothing tenant-specific lives in source.
//
// Set NEXT_PUBLIC_AUTH0_DOMAIN, NEXT_PUBLIC_AUTH0_CLIENT_ID, and (optionally)
// NEXT_PUBLIC_AUTH0_AUDIENCE in .env.local. See .env.example.
export function getConfig() {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const audienceRaw = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
  const audience =
    audienceRaw && audienceRaw !== "{yourApiIdentifier}" ? audienceRaw : null;

  return {
    domain,
    clientId,
    ...(audience ? { audience } : null),
  };
}
