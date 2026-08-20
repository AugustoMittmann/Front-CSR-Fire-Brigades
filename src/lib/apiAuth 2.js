/**
 * Bearer-token bridge between the Auth0 client (React context) and the
 * plain-JS API client (`src/lib/api.js`).
 *
 * Auth0's `getAccessTokenSilently` is only reachable via the `useAuth0` hook
 * from a React component. `api.js` is not a component and would otherwise
 * duplicate token retrieval per resource. Instead, the admin layout registers
 * a token provider on mount; every subsequent write request pulls its token
 * from here. Public GETs remain token-free.
 *
 * The provider is unset by default so public pages don't accidentally attach
 * a token. In non-admin contexts, `getAccessToken()` resolves to `null` and
 * requests go out anonymously.
 */

let tokenProvider = async () => null;

/**
 * Register a function that returns a Promise<string | null> resolving to an
 * Auth0 access token. Call this once, in an effect, from the admin layout.
 *
 * @param {() => Promise<string | null>} fn
 */
export const setTokenProvider = (fn) => {
  tokenProvider = typeof fn === "function" ? fn : async () => null;
};

/** Clear the provider — used on logout or unmount to prevent stale tokens. */
export const clearTokenProvider = () => {
  tokenProvider = async () => null;
};

/**
 * Awaited by the API client on every write. Errors from the provider (e.g.
 * silent auth failure) are swallowed here — the API layer will treat them as
 * "no token" and receive a 401 from the server, which the UI surfaces via
 * ApiError.
 *
 * @returns {Promise<string | null>}
 */
export const getAccessToken = async () => {
  try {
    return await tokenProvider();
  } catch {
    return null;
  }
};
