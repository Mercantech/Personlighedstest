import { test } from "node:test";
import assert from "node:assert/strict";
import { config } from "../src/config.js";
import {
  rolesFromPayload,
  userHasAdminRole,
  userIsAdmin,
  userOnAdminAllowlist,
} from "../src/auth.js";

test("API-konfiguration peger på Mercantec Auth", () => {
  assert.equal(config.authIssuer, "https://auth.mercantec.tech");
  assert.equal(config.authAudience, "mercantec-apps");
  assert.match(config.jwksUri, /jwks\.json$/);
});

test("ADMIN_ROLES default indeholder admin", () => {
  assert.ok(config.adminRoles.includes("admin"));
});

test("Mathias Gaardsdal Steenberg er på admin-allowlist", () => {
  assert.ok(config.adminAllowlist.includes("mathias gaardsdal steenberg"));
  assert.equal(
    userOnAdminAllowlist({ name: "Mathias Gaardsdal Steenberg" }),
    true,
  );
  assert.equal(
    userIsAdmin({ name: "Mathias Gaardsdal Steenberg", roles: [] }),
    true,
  );
  assert.equal(userOnAdminAllowlist({ name: "Anden Elev" }), false);
});

test("rolesFromPayload læser role og roles", () => {
  assert.deepEqual(rolesFromPayload({ role: "admin" }), ["admin"]);
  assert.deepEqual(rolesFromPayload({ roles: ["teacher", "admin"] }), [
    "teacher",
    "admin",
  ]);
  assert.deepEqual(rolesFromPayload({}), []);
});

test("userHasAdminRole matcher case-insensitive", () => {
  assert.equal(userHasAdminRole(["Admin"]), true);
  assert.equal(userHasAdminRole(["student"]), false);
  assert.equal(userHasAdminRole([]), false);
});
