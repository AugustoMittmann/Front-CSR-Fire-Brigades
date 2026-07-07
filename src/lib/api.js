/**
 * API client for the app — talks to the Express backend.
 *
 * Base URL comes from NEXT_PUBLIC_API_BASE_URL (defaults to localhost:4000).
 * Throws ApiError on non-2xx so callers can show error states cleanly.
 *
 * GETs are public and never attach a token. POST/PUT/DELETE ask
 * `getAccessToken()` (see src/lib/apiAuth.js) for an Auth0 access token; that
 * provider is set by the admin layout, so public pages get null and their
 * writes go out anonymously (the backend will reject them with 401, which is
 * correct — public pages shouldn't be doing writes).
 */

import { getAccessToken } from "./apiAuth";

const DEFAULT_BASE = "http://localhost:4000";

export const getApiBase = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const buildUrl = (path, params) => {
  const url = new URL(`${getApiBase()}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
};

/**
 * Low-level GET helper. Throws ApiError on non-2xx.
 *
 * `cache: "no-store"` é deliberado: o backend é a fonte da verdade e admins
 * podem editar dados a qualquer hora. Sem isso, o Next/Browser cacheiam e o
 * front fica mostrando dados antigos. Quando precisar otimizar, troque por
 * cache mais fino (ex: revalidate por rota).
 */
export const apiGet = async (path, { params, signal } = {}) => {
  const res = await fetch(buildUrl(path, params), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });
  return parseJson(res);
};

/**
 * Internal helper for writes. Attaches an Auth0 access token when one is
 * available. Body is JSON-encoded; pass `null`/`undefined` for endpoints
 * that don't want a body (they'll get `{}` to keep the Content-Type header
 * meaningful).
 */
const writeRequest = async (method, path, body, { signal, params } = {}) => {
  const token = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body ?? {}),
    signal,
  });
  return parseJson(res);
};

/** POST — send JSON body, expect JSON or 204. */
export const apiPost = (path, body, opts) => writeRequest("POST", path, body, opts);

/** PUT — same shape as POST. */
export const apiPut = (path, body, opts) => writeRequest("PUT", path, body, opts);

/**
 * DELETE — no body by default. Backend returns 204, so callers get `null`.
 */
export const apiDelete = (path, opts) => writeRequest("DELETE", path, undefined, opts);

const parseJson = async (res) => {
  let payload = null;
  // 204 No Content has empty body.
  if (res.status !== 204) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  }
  if (!res.ok) {
    const code = payload?.error?.code ?? "http_error";
    const message = payload?.error?.message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, code, message, payload);
  }
  return payload;
};

// ---------------------------------------------------------------------------
// Domain helpers — thin wrappers that map endpoints to typed call sites.
// Pages should call these instead of raw apiGet/apiPost so the surface is
// discoverable and easy to refactor.
// ---------------------------------------------------------------------------

const enc = encodeURIComponent;

/**
 * Factory for the standard CRUD-with-list resource shape used by brigades,
 * articles, news, and campaigns. Keeps the definitions dense and prevents
 * per-resource typos.
 */
const crudResource = (path) => ({
  list: (params, opts) => apiGet(path, { params, ...opts }),
  get: (id, opts) => apiGet(`${path}/${enc(id)}`, opts),
  create: (body, opts) => apiPost(path, body, opts),
  update: (id, body, opts) => apiPut(`${path}/${enc(id)}`, body, opts),
  remove: (id, opts) => apiDelete(`${path}/${enc(id)}`, opts),
});

export const api = {
  brigades: crudResource("/api/brigades"),
  campaigns: {
    ...crudResource("/api/campaigns"),
    results: (id, opts) => apiGet(`/api/campaigns/${enc(id)}/results`, opts),
  },
  news: crudResource("/api/news"),
  articles: crudResource("/api/articles"),
  faqs: {
    // Backend has no GET /:id — admin edit form loads a single FAQ from list().
    list: (params, opts) => apiGet("/api/faqs", { params, ...opts }),
    create: (body, opts) => apiPost("/api/faqs", body, opts),
    update: (id, body, opts) => apiPut(`/api/faqs/${enc(id)}`, body, opts),
    remove: (id, opts) => apiDelete(`/api/faqs/${enc(id)}`, opts),
  },
  profiles: {
    me: (opts) => apiGet("/api/profiles/me", opts),
    list: (params, opts) => apiGet("/api/profiles", { params, ...opts }),
    get: (id, opts) => apiGet(`/api/profiles/${enc(id)}`, opts),
    create: (body, opts) => apiPost("/api/profiles", body, opts),
    update: (id, body, opts) => apiPut(`/api/profiles/${enc(id)}`, body, opts),
    validate: (id, opts) => apiPost(`/api/profiles/${enc(id)}/validate`, {}, opts),
    revoke: (id, opts) => apiPost(`/api/profiles/${enc(id)}/revoke`, {}, opts),
  },
  contacts: {
    create: (body, opts) => apiPost("/api/contacts", body, opts),
  },
  events: {
    track: (body, opts) => apiPost("/api/events", body, opts),
  },
};
