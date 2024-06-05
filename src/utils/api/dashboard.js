import instance from "./index";

export function getLastCollections() {
  return instance.get("/api/dashboard/last_collections/");
}

export function getLastInvoices() {
  return instance.get("/api/dashboard/last_invoices/");
}
