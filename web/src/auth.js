/**
 * Mercantec Auth — SPA-klient (authorization code + PKCE S256).
 * Tokens i sessionStorage (ikke localStorage). JWT-payload dekodes kun til UI.
 * Token-byt går via eget API (CORS-fri).
 */

const AUTH_BASE = "https://auth.mercantec.tech";
const TOKEN_TIMEOUT_MS = 20_000;

function callbackRedirectUri() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  return (
    import.meta.env.VITE_AUTH_REDIRECT_URI ||
    "http://localhost:5173/auth/callback"
  );
}

export const authConfig = {
  issuer: AUTH_BASE,
  authorizeUrl: `${AUTH_BASE}/oauth/authorize`,
  tokenUrl: `${AUTH_BASE}/oauth/token`,
  signoutUrl: `${AUTH_BASE}/signout`,
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID || "samspil",
  get redirectUri() {
    return callbackRedirectUri();
  },
  apiBase: import.meta.env.VITE_API_BASE_URL || "/api",
  get tokenProxyUrl() {
    return `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth/token`;
  },
};

const KEYS = {
  verifier: "samspil_pkce_verifier",
  state: "samspil_oauth_state",
  access: "samspil_access_token",
  refresh: "samspil_refresh_token",
  expiresAt: "samspil_expires_at",
  exchangeLock: "samspil_oauth_exchange_lock",
};

function randomString(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return base64Url(arr);
}

function base64Url(data) {
  const bytes =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : data instanceof ArrayBuffer
        ? new Uint8Array(data)
        : data;
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(plain) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(plain));
}

export async function beginLogin() {
  const verifier = randomString(48);
  const state = randomString(24);
  const challenge = base64Url(await sha256(verifier));
  sessionStorage.setItem(KEYS.verifier, verifier);
  sessionStorage.setItem(KEYS.state, state);
  sessionStorage.removeItem(KEYS.exchangeLock);
  const url = new URL(authConfig.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", authConfig.clientId);
  url.searchParams.set("redirect_uri", authConfig.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  window.location.assign(url.toString());
}

function storeTokens({ access_token, refresh_token, expires_in }) {
  if (!access_token) throw new Error("Token-svar mangler access_token");
  sessionStorage.setItem(KEYS.access, access_token);
  if (refresh_token) sessionStorage.setItem(KEYS.refresh, refresh_token);
  const expiresAt =
    Date.now() + Math.max(30, Number(expires_in || 900) - 30) * 1000;
  sessionStorage.setItem(KEYS.expiresAt, String(expiresAt));
}

export function clearTokens() {
  sessionStorage.removeItem(KEYS.access);
  sessionStorage.removeItem(KEYS.refresh);
  sessionStorage.removeItem(KEYS.expiresAt);
  sessionStorage.removeItem(KEYS.verifier);
  sessionStorage.removeItem(KEYS.state);
  sessionStorage.removeItem(KEYS.exchangeLock);
}

export function getAccessToken() {
  return sessionStorage.getItem(KEYS.access);
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}

export function decodeJwtPayload(token = getAccessToken()) {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserProfile() {
  const payload = decodeJwtPayload();
  if (!payload?.sub) return null;
  const raw = payload.role ?? payload.roles ?? [];
  const roles = Array.isArray(raw)
    ? raw.map(String)
    : raw
      ? [String(raw)]
      : [];
  return {
    sub: String(payload.sub),
    name: payload.name ? String(payload.name) : null,
    email: payload.email ? String(payload.email) : null,
    roles,
    loginMethod: payload.login_method ? String(payload.login_method) : null,
  };
}

/** JWT-roller der giver adgang til admin-dashboard (matcher API ADMIN_ROLES). */
export function adminRoleList() {
  return String(import.meta.env.VITE_ADMIN_ROLES || "admin")
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
}

/** Navne/emails/subs med admin-adgang uanset rolle (matcher API ADMIN_ALLOWLIST). */
const BUILTIN_ADMIN_ALLOWLIST = ["mathias gaardsdal steenberg"];

export function adminAllowlist() {
  const fromEnv = String(import.meta.env.VITE_ADMIN_ALLOWLIST || "")
    .split(",")
    .map((item) => item.trim().toLowerCase().replace(/\s+/g, " "))
    .filter(Boolean);
  return [...new Set([...BUILTIN_ADMIN_ALLOWLIST, ...fromEnv])];
}

function normalizeIdentity(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function isAdmin(user = getUserProfile()) {
  if (!user) return false;
  const allowedRoles = new Set(adminRoleList());
  if (
    user.roles?.some((role) => allowedRoles.has(String(role).toLowerCase()))
  ) {
    return true;
  }
  const allowlist = new Set(adminAllowlist());
  const candidates = [user.name, user.email, user.sub]
    .map(normalizeIdentity)
    .filter(Boolean);
  return candidates.some((id) => allowlist.has(id));
}

async function postToken(body) {
  const res = await fetch(authConfig.tokenProxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.error_description || data.error || "Token-udveksling fejlede",
    );
  }
  storeTokens(data);
  return data;
}

export async function handleAuthCallback(
  searchParams = new URLSearchParams(window.location.search),
) {
  const error = searchParams.get("error");
  if (error) {
    clearTokens();
    throw new Error(searchParams.get("error_description") || error);
  }
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expected = sessionStorage.getItem(KEYS.state);
  const verifier = sessionStorage.getItem(KEYS.verifier);

  if (isLoggedIn() && (!verifier || !expected)) {
    return { already: true };
  }

  if (!code || !state || !expected || state !== expected || !verifier) {
    clearTokens();
    throw new Error(
      "Ugyldigt login-svar (state/code). Prøv at logge ind igen.",
    );
  }

  const lock = `${KEYS.exchangeLock}:${code}`;
  if (sessionStorage.getItem(lock) === "done") {
    return { already: true };
  }
  if (sessionStorage.getItem(lock) === "pending") {
    await new Promise((r) => setTimeout(r, 500));
    if (isLoggedIn()) return { already: true };
    throw new Error("Login er allerede i gang. Genindlæs siden om et øjeblik.");
  }
  sessionStorage.setItem(lock, "pending");

  try {
    await postToken({
      grant_type: "authorization_code",
      code,
      redirect_uri: authConfig.redirectUri,
      client_id: authConfig.clientId,
      code_verifier: verifier,
    });
    sessionStorage.setItem(lock, "done");
    sessionStorage.removeItem(KEYS.verifier);
    sessionStorage.removeItem(KEYS.state);
    return { ok: true };
  } catch (err) {
    sessionStorage.removeItem(lock);
    throw err;
  }
}

async function refreshAccessToken() {
  const refresh = sessionStorage.getItem(KEYS.refresh);
  if (!refresh) throw new Error("Ingen refresh-token");
  await postToken({
    grant_type: "refresh_token",
    refresh_token: refresh,
    client_id: authConfig.clientId,
  });
}

export async function ensureFreshAccessToken() {
  const token = getAccessToken();
  if (!token) return null;
  const expiresAt = Number(sessionStorage.getItem(KEYS.expiresAt) || 0);
  if (Date.now() < expiresAt) return token;
  try {
    await refreshAccessToken();
    return getAccessToken();
  } catch {
    clearTokens();
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${authConfig.apiBase}${path.startsWith("/") ? path : `/${path}`}`;

  async function once(forceRefresh = false) {
    if (forceRefresh) await refreshAccessToken();
    else await ensureFreshAccessToken();
    const token = getAccessToken();
    if (!token) {
      const err = new Error("Ikke logget ind");
      err.status = 401;
      throw err;
    }
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const { signal: userSignal, ...rest } = options;
    const signal = userSignal || AbortSignal.timeout(TOKEN_TIMEOUT_MS);
    return fetch(url, { ...rest, headers, signal });
  }

  let res = await once(false);
  if (res.status === 401) {
    try {
      res = await once(true);
    } catch {
      clearTokens();
      const err = new Error("Session udløbet — log ind igen");
      err.status = 401;
      throw err;
    }
  }
  return res;
}

/** Logger kun ud af Samspil (rydder tokens). Auth-sessionen på mercantec.tech bevares. */
export function logout() {
  clearTokens();
  window.location.replace(`${window.location.origin}/#/`);
}

export function isAuthCallbackPath() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return path === "/callback.html" || path === "/auth/callback";
}

export function finishAuthRedirect() {
  window.location.replace(`${window.location.origin}/#/`);
}
