# Security

## Reporting

Found something? Open a GitHub issue with the `security` label, or contact the
maintainers privately if the issue is sensitive. Please don't post exploit
details in public PRs.

## Known issues that need owner action

### Supabase keys leaked in git history

Commit `c849e24` introduced a `.env` file containing a Supabase URL and anon
key. The file was removed in commit `9799717`, but the values remain
recoverable from git history. The keys were:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**The keys have not been rotated.** Anyone with read access to this repo's
history can recover them. Action items, in order:

1. **Rotate** the Supabase project's anon key (and any other keys committed
   alongside it) in the Supabase dashboard. The old key becomes inert
   immediately, even though it stays visible in git history.
2. **Optionally purge from history** with `git filter-repo --path .env
   --invert-paths`, then force-push. This requires coordinating with every
   collaborator who has a clone — they'll need to re-clone or reset their
   local history. If the repo is private and the team is small, this is
   tractable; if it's public, rotation alone is the realistic choice.
3. **Add a pre-commit secret scanner** (e.g. `gitleaks` via `pre-commit`) to
   prevent recurrence.

### Auth0 dev-tenant values

`src/app/auth_config.json` was committed with the dev-tenant `domain` and
`clientId`. Both are technically public for SPA Auth0 flows, but the file has
been removed in this branch and the values now come from
`NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID` (see
`.env.example`). When a production tenant is provisioned, point those env vars
at it and confirm the **Allowed Callback URLs** in Auth0 contain the deployed
origin only.

### Google Maps API keys

Two Google Maps API keys are used:

- `NEXT_PUBLIC_MAPS_API_KEY` — used by `@vis.gl/react-google-maps` in the
  browser. This must stay client-side. Restrict it in Google Cloud Console to
  the Maps JavaScript API and the deployed HTTP referrers only.
- `GOOGLE_MAPS_GEOCODING_KEY` — used by the prototype geocoder in
  `src/lib/prototypes/prototype_location_converter.js`, which is **server-only**
  (`import "server-only"`). Restrict to the Geocoding API and a server IP
  allow-list. Do **not** prefix this var with `NEXT_PUBLIC_`.

## Response headers

Baseline security headers are configured in `next.config.mjs`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

A Content-Security-Policy is **not** configured. Adding one will require
allow-listing the Google Maps, Auth0, and Google Fonts origins; doing it well
is a follow-up.

## Dependency vulnerabilities

Run `npm audit` regularly. Two remaining moderate items live inside Next.js's
internal `postcss` and have no fix below a Next 9 downgrade — track upstream.
