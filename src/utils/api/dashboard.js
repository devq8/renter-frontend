import { fetchAllPages } from "./_normalize";

// Both are paginated list endpoints — return flat arrays.
export function getLastCollections() {
  return fetchAllPages("/api/dashboard/last_collections/");
}

export function getLastInvoices() {
  return fetchAllPages("/api/dashboard/last_invoices/");
}
