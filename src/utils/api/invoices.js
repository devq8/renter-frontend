// import axios from "axios";
import instance from "./index";

export function getInvoices({ contract_id = null, status = null } = {}) {
  if (contract_id == null && status == null) {
    return instance.get(`/api/invoices/`);
  }

  if (contract_id && status) {
    return instance.get(
      `/api/invoices/?contract=${contract_id}&status=${status}`
    );
  }

  if (status == null && contract_id) {
    return instance.get(`/api/invoices/?contract=${contract_id}`);
  } else if (contract_id == null && status) {
    return instance.get(`/api/invoices/?status=${status}`);
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
