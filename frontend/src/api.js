const API = process.env.REACT_APP_BACKEND_URL;

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}/api${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data && data.detail;
    let msg = "Une erreur est survenue. Réessayez.";
    if (typeof detail === "string") msg = detail;
    else if (Array.isArray(detail))
      msg = detail.map((e) => (e && typeof e.msg === "string" ? e.msg : "")).filter(Boolean).join(" ");
    else if (detail && typeof detail.msg === "string") msg = detail.msg;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function formatApiError(err) {
  return err && err.message ? err.message : "Une erreur est survenue. Réessayez.";
}
