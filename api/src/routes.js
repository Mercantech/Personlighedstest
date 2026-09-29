import { Router } from "express";
import {
  adminDeleteResult,
  adminOverview,
  countAdminResults,
  deleteResult,
  getCurrentResult,
  listAdminResults,
  listResults,
  upsertResult,
} from "./db.js";
import { requireAuth, requireAdmin } from "./auth.js";
import { config } from "./config.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "samspil-api" });
});

/**
 * Proxy til Mercantec /oauth/token — SPA undgår CORS på auth-hosten.
 * Body (JSON): grant_type + de felter Mercantec forventer.
 */
router.post("/auth/token", async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.grant_type || !body.client_id) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }
    const upstream = await fetch(`${config.authIssuer}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(
        Object.fromEntries(
          Object.entries(body).filter(
            ([, value]) => value !== undefined && value !== null && value !== "",
          ),
        ),
      ),
    });
    const data = await upstream.json().catch(() => ({}));
    res.status(upstream.status).json(data);
  } catch (error) {
    res.status(502).json({
      error: "token_proxy_failed",
      error_description: error.message,
    });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get("/me/result", requireAuth, async (req, res) => {
  try {
    const result = await getCurrentResult(req.user.sub);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/me/result", requireAuth, async (req, res) => {
  try {
    const saved = await upsertResult(req.user.sub, req.body, {
      asCurrent: true,
    });
    res.json({ result: saved });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/me/results", requireAuth, async (req, res) => {
  try {
    const results = await listResults(req.user.sub);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/me/results/:id", requireAuth, async (req, res) => {
  try {
    if (req.body?.id && req.body.id !== req.params.id) {
      res.status(400).json({ error: "id_mismatch" });
      return;
    }
    const saved = await upsertResult(
      req.user.sub,
      { ...req.body, id: req.params.id },
      { asCurrent: false },
    );
    res.json({ result: saved });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/me/results/:id", requireAuth, async (req, res) => {
  try {
    const ok = await deleteResult(req.user.sub, req.params.id);
    if (!ok) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/admin/overview", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const overview = await adminOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/admin/results", requireAuth, requireAdmin, async (req, res) => {
  try {
    const currentOnly = req.query.currentOnly !== "false";
    const params = {
      currentOnly,
      q: String(req.query.q || ""),
      code: String(req.query.code || ""),
      family: String(req.query.family || ""),
      hasX: String(req.query.hasX || ""),
      minLength: req.query.minLength,
      maxLength: req.query.maxLength,
      limit: req.query.limit,
      offset: req.query.offset,
    };
    const [results, total] = await Promise.all([
      listAdminResults(params),
      countAdminResults({ currentOnly }),
    ]);
    res.json({ results, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete(
  "/admin/results/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const ok = await adminDeleteResult(req.params.id);
      if (!ok) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
