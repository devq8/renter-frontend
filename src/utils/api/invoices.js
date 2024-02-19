// import axios from "axios";
import instance from "./index";

export function getInvoices(contract_id, status) {
  if (contract_id && status) {
    return instance.get(
      `/api/invoices/?contract=${contract_id}&status=${status}`
    );
  }
  if (contract_id) {
    return instance.get(`/api/invoices/?contract=${contract_id}`);
  } else {
    return instance.get("/api/invoices/");
  }
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
