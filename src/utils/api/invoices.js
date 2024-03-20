// import axios from "axios";
import instance from "./index";

export function getInvoices(contract_id = null, invoice_status = null) {
  console.log("Contract: ", contract_id);
  console.log("Status: ", invoice_status);

  let url = "/api/invoices/";

  if (contract_id && invoice_status) {
    url += `?contract=${contract_id}&status=${invoice_status}`;
  } else if (contract_id) {
    url += `?contract=${contract_id}`;
  } else if (invoice_status) {
    url += `?status=${invoice_status}`;
  }

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
