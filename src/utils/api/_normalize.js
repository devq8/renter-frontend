import instance from "./index";

// Walk every page of a DRF-paginated list endpoint and return a flat array of
// all items. The backend enables PageNumberPagination globally (PAGE_SIZE 20),
// so list endpoints respond with { count, next, previous, results: [...] }.
// Tolerant of a bare array too (APIView endpoints that aren't paginated).
export async function fetchAllPages(url, config = {}) {
  let results = [];
  let page = 1;

  while (true) {
    const res = await instance.get(url, {
      ...config,
      params: { ...(config.params || {}), page },
    });
    const body = res.data;

    if (Array.isArray(body)) {
      results = results.concat(body);
      break;
    }

    results = results.concat(body?.results ?? []);
    if (!body?.next) break;
    page += 1;
  }

  return results;
}

export function normalizeListResponse(raw) {
  // Common DRF shapes:
  // { count, next, previous, results: [...] }
  // or { data: [...] } or plain [...]
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.results)
    ? raw.results
    : Array.isArray(raw?.data)
    ? raw.data
    : [];

  const count = Number.isFinite(raw?.count) ? raw.count : items.length;
  const next = raw?.next ?? null;
  const previous = raw?.previous ?? null;

  return { items, count, next, previous, raw };
}
