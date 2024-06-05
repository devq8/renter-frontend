// import axios from "axios";
import instance from "./index";

export function getInvoices({
  contract_id = null,
  invoice_status = null,
  uid = null,
} = {}) {
  console.log("Contract ID is :", contract_id);
  let url = "/api/invoices/";
  let queryParams = [];

  if (uid) queryParams.push(`uid=${uid}`);
  if (contract_id) queryParams.push(`contract=${contract_id}`);
  if (invoice_status) queryParams.push(`status=${invoice_status}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  console.log("URL:", url);
  return instance.get(url);
}

export function getInvoiceDetails(invoice_id) {
  return instance.get(`/api/invoices/${invoice_id}/`);
}

export function addInvoice(invoice) {
  console.log(`Adding invoice`);
  console.log(invoice);
  return instance.post(`/api/invoices/add/`, invoice);
}

export function deleteInvoiceDocument(document_id) {
  console.log(`Delete Invoice Document ID: ${document_id}`);
  return instance.delete(`/api/invoices/documents/${document_id}`);
}
