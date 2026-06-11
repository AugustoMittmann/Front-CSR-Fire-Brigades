/**
 * API client for the public app — talks to the Express backend (no auth).
 *
 * Base URL comes from NEXT_PUBLIC_API_BASE_URL (defaults to localhost:4000).
 * Throws ApiError on non-2xx so callers can show error states cleanly.
 */

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

/**
 * Build a fully-qualified URL with optional query string.
 * @param {string} path  e.g. "/api/brigades"
 * @param {Object} [params]
 */
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
 *
 * @param {string} path
 * @param {Object} [opts]
 * @param {Object} [opts.params]
 * @param {AbortSignal} [opts.signal]
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

/** Same as apiGet but for POST. Used by the public POST /api/contacts. */
export const apiPost = async (path, body, { signal } = {}) => {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
    signal,
  });
  return parseJson(res);
};

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

export const api = {
  brigades: {
    list: (params, opts) => apiGet("/api/brigades", { params, ...opts }),
    get: (id, opts) => apiGet(`/api/brigades/${encodeURIComponent(id)}`, opts),
  },
  campaigns: {
    list: (params, opts) => apiGet("/api/campaigns", { params, ...opts }),
    get: (id, opts) => apiGet(`/api/campaigns/${encodeURIComponent(id)}`, opts),
    results: (id, opts) =>
      apiGet(`/api/campaigns/${encodeURIComponent(id)}/results`, opts),
  },
  news: {
    list: (params, opts) => apiGet("/api/news", { params, ...opts }),
    get: (id, opts) => apiGet(`/api/news/${encodeURIComponent(id)}`, opts),
  },
  articles: {
    list: (params, opts) => apiGet("/api/articles", { params, ...opts }),
    get: (id, opts) => apiGet(`/api/articles/${encodeURIComponent(id)}`, opts),
  },
  faqs: {
    list: (params, opts) => apiGet("/api/faqs", { params, ...opts }),
  },
  contacts: {
    create: (body, opts) => apiPost("/api/contacts", body, opts),
  },
  events: {
    track: (body, opts) => apiPost("/api/events", body, opts),
  },
};
