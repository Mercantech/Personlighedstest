import pg from "pg";
import { config } from "./config.js";

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

export async function query(text, params) {
  return pool.query(text, params);
}

export async function upsertAccount({ sub, email, name }) {
  await query(
    `INSERT INTO accounts (sub, email, name, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (sub) DO UPDATE
       SET email = COALESCE(EXCLUDED.email, accounts.email),
           name = COALESCE(EXCLUDED.name, accounts.name),
           updated_at = now()`,
    [sub, email || null, name || null],
  );
}

function mapResult(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    scores: row.scores,
    answers: row.answers,
    instrument: row.instrument,
    balanced: row.balanced,
    length: row.length ?? 60,
    createdAt: row.created_at.toISOString?.() || row.created_at,
  };
}

const RESULT_COLUMNS =
  "id, name, code, scores, answers, instrument, balanced, length, created_at";

export async function listResults(userSub) {
  const { rows } = await query(
    `SELECT ${RESULT_COLUMNS}
     FROM results
     WHERE user_sub = $1
     ORDER BY created_at DESC`,
    [userSub],
  );
  return rows.map(mapResult);
}

export async function getCurrentResult(userSub) {
  const { rows } = await query(
    `SELECT ${RESULT_COLUMNS.split(", ").map((c) => `r.${c}`).join(", ")}
     FROM accounts a
     JOIN results r ON r.id = a.current_result_id
     WHERE a.sub = $1`,
    [userSub],
  );
  return mapResult(rows[0]);
}

export async function upsertResult(userSub, record, { asCurrent = false } = {}) {
  if (!record?.id || !record.name || !record.code || !record.instrument)
    throw new Error("Ugyldigt resultat.");
  if (!Array.isArray(record.scores) || !Array.isArray(record.answers))
    throw new Error("Ugyldigt resultat.");

  const length = Number(record.length) || 60;

  await query(
    `INSERT INTO results (
       id, user_sub, name, code, scores, answers, instrument, balanced, length, created_at, synced_at
     ) VALUES (
       $1, $2, $3, $4, $5::int[], $6::int[], $7, $8, $9, $10::timestamptz, now()
     )
     ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           code = EXCLUDED.code,
           scores = EXCLUDED.scores,
           answers = EXCLUDED.answers,
           instrument = EXCLUDED.instrument,
           balanced = EXCLUDED.balanced,
           length = EXCLUDED.length,
           created_at = EXCLUDED.created_at,
           synced_at = now()
     WHERE results.user_sub = $2`,
    [
      record.id,
      userSub,
      record.name,
      record.code,
      record.scores,
      record.answers,
      record.instrument,
      !!record.balanced,
      length,
      record.createdAt || new Date().toISOString(),
    ],
  );

  if (asCurrent) {
    await query(
      `UPDATE accounts
       SET current_result_id = $2, updated_at = now()
       WHERE sub = $1`,
      [userSub, record.id],
    );
  }

  return { ...record, length };
}

export async function deleteResult(userSub, id) {
  const { rowCount } = await query(
    `DELETE FROM results WHERE id = $1 AND user_sub = $2`,
    [id, userSub],
  );
  return rowCount > 0;
}

function mapAdminResult(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    scores: row.scores,
    instrument: row.instrument,
    balanced: row.balanced,
    length: row.length ?? 60,
    createdAt: row.created_at.toISOString?.() || row.created_at,
    userSub: row.user_sub,
    email: row.email || null,
    accountName: row.account_name || null,
    isCurrent: Boolean(row.is_current),
  };
}

const ADMIN_LIST_COLUMNS = `
  r.id, r.name, r.code, r.scores, r.instrument, r.balanced, r.length,
  r.created_at, r.user_sub,
  a.email, a.name AS account_name,
  (a.current_result_id IS NOT NULL AND a.current_result_id = r.id) AS is_current
`;

function expandFamilyCodes(family) {
  const map = {
    analysts: ["INTJ", "INTP", "ENTJ", "ENTP"],
    diplomats: ["INFJ", "INFP", "ENFJ", "ENFP"],
    sentinels: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    explorers: ["ISTP", "ISFP", "ESTP", "ESFP"],
  };
  return map[family] || null;
}

/** Matcher en (evt. X-holdig) kode mod en konkret 4-bogstavsprofil. */
function codeMatchesConcrete(pattern, concrete) {
  if (!pattern || pattern.length !== 4 || !concrete || concrete.length !== 4)
    return false;
  const p = pattern.toUpperCase();
  const c = concrete.toUpperCase();
  for (let i = 0; i < 4; i++) {
    if (p[i] !== "X" && p[i] !== c[i]) return false;
  }
  return true;
}

function rowMatchesFamily(code, family) {
  const concretes = expandFamilyCodes(family);
  if (!concretes) return true;
  return concretes.some((c) => codeMatchesConcrete(code, c));
}

export async function listAdminResults({
  currentOnly = true,
  q = "",
  code = "",
  family = "",
  hasX = "",
  minLength,
  maxLength,
  limit = 100,
  offset = 0,
} = {}) {
  const clauses = [];
  const params = [];
  let i = 1;

  if (currentOnly) {
    clauses.push(`a.current_result_id = r.id`);
  }
  if (q) {
    clauses.push(
      `(r.name ILIKE $${i} OR COALESCE(a.email, '') ILIKE $${i} OR COALESCE(a.name, '') ILIKE $${i} OR r.code ILIKE $${i})`,
    );
    params.push(`%${q}%`);
    i++;
  }
  if (code) {
    clauses.push(`UPPER(r.code) = UPPER($${i})`);
    params.push(code);
    i++;
  }
  if (hasX === "yes") {
    clauses.push(`r.code LIKE '%X%'`);
  } else if (hasX === "no") {
    clauses.push(`r.code NOT LIKE '%X%'`);
  } else if (hasX === "balanced") {
    clauses.push(`r.balanced = true`);
  }
  if (minLength != null && Number.isFinite(Number(minLength))) {
    clauses.push(`r.length >= $${i}`);
    params.push(Number(minLength));
    i++;
  }
  if (maxLength != null && Number.isFinite(Number(maxLength))) {
    clauses.push(`r.length <= $${i}`);
    params.push(Number(maxLength));
    i++;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await query(
    `SELECT ${ADMIN_LIST_COLUMNS}
     FROM results r
     JOIN accounts a ON a.sub = r.user_sub
     ${where}
     ORDER BY r.created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    [...params, Math.min(500, Math.max(1, Number(limit) || 100)), Math.max(0, Number(offset) || 0)],
  );

  let mapped = rows.map(mapAdminResult);
  if (family) {
    mapped = mapped.filter((r) => rowMatchesFamily(r.code, family));
  }
  return mapped;
}

export async function countAdminResults({ currentOnly = true } = {}) {
  const where = currentOnly ? "WHERE a.current_result_id = r.id" : "";
  const { rows } = await query(
    `SELECT COUNT(*)::int AS n
     FROM results r
     JOIN accounts a ON a.sub = r.user_sub
     ${where}`,
  );
  return rows[0]?.n ?? 0;
}

export async function adminOverview() {
  const [
    { rows: totals },
    { rows: codeRows },
    { rows: recent },
    { rows: dayWeek },
  ] = await Promise.all([
    query(`
      SELECT
        (SELECT COUNT(*)::int FROM accounts WHERE current_result_id IS NOT NULL) AS students_with_profile,
        (SELECT COUNT(*)::int FROM results) AS total_results
    `),
    query(`
      SELECT r.code, COUNT(*)::int AS count
      FROM results r
      JOIN accounts a ON a.sub = r.user_sub AND a.current_result_id = r.id
      GROUP BY r.code
      ORDER BY count DESC, r.code
    `),
    query(`
      SELECT ${ADMIN_LIST_COLUMNS}
      FROM results r
      JOIN accounts a ON a.sub = r.user_sub
      ORDER BY r.created_at DESC
      LIMIT 10
    `),
    query(`
      SELECT
        COUNT(*) FILTER (WHERE r.created_at >= date_trunc('day', now()))::int AS today,
        COUNT(*) FILTER (WHERE r.created_at >= now() - interval '7 days')::int AS week
      FROM results r
    `),
  ]);

  const byCode = codeRows.map((r) => ({ code: r.code, count: r.count }));
  const exactFamily = {
    INTJ: "analysts",
    INTP: "analysts",
    ENTJ: "analysts",
    ENTP: "analysts",
    INFJ: "diplomats",
    INFP: "diplomats",
    ENFJ: "diplomats",
    ENFP: "diplomats",
    ISTJ: "sentinels",
    ISFJ: "sentinels",
    ESTJ: "sentinels",
    ESFJ: "sentinels",
    ISTP: "explorers",
    ISFP: "explorers",
    ESTP: "explorers",
    ESFP: "explorers",
  };
  const familyKeys = ["analysts", "diplomats", "sentinels", "explorers"];
  const byFamily = familyKeys.map((key) => ({
    family: key,
    count: byCode
      .filter((row) => exactFamily[String(row.code).toUpperCase()] === key)
      .reduce((n, row) => n + row.count, 0),
  }));

  return {
    studentsWithProfile: totals[0]?.students_with_profile ?? 0,
    totalResults: totals[0]?.total_results ?? 0,
    testsToday: dayWeek[0]?.today ?? 0,
    testsThisWeek: dayWeek[0]?.week ?? 0,
    byCode,
    byFamily,
    recent: recent.map(mapAdminResult),
  };
}

export async function adminDeleteResult(id) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT id, user_sub FROM results WHERE id = $1`,
      [id],
    );
    if (!rows[0]) {
      await client.query("ROLLBACK");
      return false;
    }
    const { user_sub: userSub } = rows[0];
    await client.query(
      `UPDATE accounts SET current_result_id = NULL, updated_at = now()
       WHERE current_result_id = $1`,
      [id],
    );
    await client.query(`DELETE FROM results WHERE id = $1`, [id]);
    const { rows: latest } = await client.query(
      `SELECT id FROM results WHERE user_sub = $1 ORDER BY created_at DESC LIMIT 1`,
      [userSub],
    );
    if (latest[0]) {
      await client.query(
        `UPDATE accounts SET current_result_id = $2, updated_at = now() WHERE sub = $1`,
        [userSub, latest[0].id],
      );
    }
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
