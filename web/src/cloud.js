import { apiFetch, isLoggedIn } from "./auth.js";

export async function fetchMe() {
  const res = await apiFetch("/me");
  if (!res.ok) throw new Error("Kunne ikke hente brugerprofil");
  return res.json();
}

export async function fetchCloudResult() {
  const res = await apiFetch("/me/result");
  if (!res.ok) throw new Error("Kunne ikke hente gemt resultat");
  const data = await res.json();
  return data.result || null;
}

export async function fetchCloudResults() {
  const res = await apiFetch("/me/results");
  if (!res.ok) throw new Error("Kunne ikke hente samling");
  const data = await res.json();
  return data.results || [];
}

export async function saveCloudResult(record) {
  const res = await apiFetch("/me/result", {
    method: "PUT",
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Kunne ikke gemme resultat på kontoen");
  }
  return res.json();
}

export async function saveCloudCollectionItem(record) {
  const res = await apiFetch(`/me/results/${record.id}`, {
    method: "PUT",
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Kunne ikke gemme i cloud-samling");
  }
  return res.json();
}

export async function deleteCloudResult(id) {
  const res = await apiFetch(`/me/results/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Kunne ikke slette fra kontoen");
  }
}

export async function syncFromCloud() {
  if (!isLoggedIn()) return null;
  const [current, results] = await Promise.all([
    fetchCloudResult(),
    fetchCloudResults(),
  ]);
  return { current, results };
}

function adminQuery(params = {}) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    q.set(key, String(value));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function fetchAdminOverview() {
  const res = await apiFetch("/admin/overview");
  if (res.status === 403) throw new Error("Kræver underviserrolle");
  if (!res.ok) throw new Error("Kunne ikke hente admin-overblik");
  return res.json();
}

export async function fetchAdminResults(params = {}) {
  const res = await apiFetch(`/admin/results${adminQuery(params)}`);
  if (res.status === 403) throw new Error("Kræver underviserrolle");
  if (!res.ok) throw new Error("Kunne ikke hente alle tests");
  return res.json();
}

export async function deleteAdminResult(id) {
  const res = await apiFetch(`/admin/results/${id}`, { method: "DELETE" });
  if (res.status === 403) throw new Error("Kræver underviserrolle");
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Kunne ikke slette resultatet");
  }
}
