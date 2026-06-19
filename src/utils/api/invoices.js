// import axios from "axios";
import instance from "./index";
import { fetchAllPages } from "./_normalize";

// Contract-scoped / full fetch — return a flat array of all matching invoices.
// Used where the whole set is needed at once (e.g. a single contract's invoices).
export function getInvoices({
  contract_id = null,
  invoice_status = null,
  uid = null,
} = {}) {
  // console.log("Contract ID is :", contract_id);
  const params = {};
  if (uid) params.uid = uid;
  if (contract_id) params.contract = contract_id;
  if (invoice_status) params.status = invoice_status;

  return fetchAllPages("/api/invoices/", { params });
}

// Server-side paginated fetch for the invoices browser. Returns the raw DRF
// page body: { count, next, previous, results }. Filters are applied on the
// backend (see InvoiceListView).
export function getInvoicesPage({
  page = 1,
  pageSize = 20,
  search = "",
  status = "",
  property = "",
  invoiceType = "",
} = {}) {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  if (status) params.status = status;
  if (property) params.property = property;
  if (invoiceType) params.invoice_type = invoiceType;

  return instance.get("/api/invoices/", { params }).then((res) => res.data);
}

export function getInvoiceDetails(invoice_id) {
  return instance.get(`/api/invoices/${invoice_id}/`);
}

export function addInvoice(invoice) {
  console.log(`Adding invoice`);
  console.log(invoice);
  return instance.post(`/api/invoices/add/`, invoice);
}

export function cancelInvoice(invoice) {
  return instance.patch(`/api/invoices/${invoice.id}/update/`, invoice);
}

export function deleteInvoiceDocument(document_id) {
  console.log(`Delete Invoice Document ID: ${document_id}`);
  return instance.delete(`/api/invoices/documents/${document_id}`);
}
