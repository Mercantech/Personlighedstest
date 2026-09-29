function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Mangler miljøvariabel: ${name}`);
  return value;
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase().replace(/\s+/g, " "))
    .filter(Boolean);
}

/** Navne/emails/subs med admin-adgang uanset JWT-rolle. */
const DEFAULT_ADMIN_ALLOWLIST = ["mathias gaardsdal steenberg"];

export const config = {
  port: Number(process.env.PORT || 3001),
  host: process.env.HOST || "127.0.0.1",
  databaseUrl: required(
    "DATABASE_URL",
    "postgres://samspil:samspil@127.0.0.1:5432/samspil",
  ),
  authIssuer: required("AUTH_ISSUER", "https://auth.mercantec.tech"),
  authAudience: required("AUTH_AUDIENCE", "mercantec-apps"),
  jwksUri: required(
    "JWKS_URI",
    "https://auth.mercantec.tech/.well-known/jwks.json",
  ),
  corsOrigin: process.env.CORS_ORIGIN || "http://127.0.0.1:5173",
  adminRoles: parseList(process.env.ADMIN_ROLES || "admin"),
  adminAllowlist: [
    ...new Set([
      ...DEFAULT_ADMIN_ALLOWLIST,
      ...parseList(process.env.ADMIN_ALLOWLIST),
    ]),
  ],
};
