import { createRemoteJWKSet, jwtVerify } from "jose";
import { config } from "./config.js";
import { upsertAccount } from "./db.js";

const JWKS = createRemoteJWKSet(new URL(config.jwksUri));

export function rolesFromPayload(payload) {
  const raw = payload.role ?? payload.roles ?? [];
  return Array.isArray(raw) ? raw : [raw].filter(Boolean);
}

export function userHasAdminRole(roles = []) {
  const allowed = new Set(config.adminRoles);
  return roles.some((role) => allowed.has(String(role).toLowerCase()));
}

function normalizeIdentity(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Matcher navn, email eller sub mod ADMIN_ALLOWLIST (+ indbyggede navne). */
export function userOnAdminAllowlist(user = {}) {
  const allowed = new Set(config.adminAllowlist);
  if (!allowed.size) return false;
  const candidates = [user.name, user.email, user.sub]
    .map(normalizeIdentity)
    .filter(Boolean);
  return candidates.some((id) => allowed.has(id));
}

export function userIsAdmin(user = {}) {
  return userHasAdminRole(user.roles || []) || userOnAdminAllowlist(user);
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    res.status(401).json({ error: "missing_token" });
    return;
  }
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: config.authIssuer,
      audience: config.authAudience,
      algorithms: ["RS256"],
    });
    if (!payload.sub) {
      res.status(401).json({ error: "invalid_token" });
      return;
    }
    const user = {
      sub: String(payload.sub),
      name: payload.name ? String(payload.name) : null,
      email: payload.email ? String(payload.email) : null,
      roles: rolesFromPayload(payload).map(String),
      loginMethod: payload.login_method
        ? String(payload.login_method)
        : null,
    };
    await upsertAccount(user);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    res.status(401).json({ error: "missing_token" });
    return;
  }
  if (!userIsAdmin(req.user)) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  next();
}
