// import axios from "axios";
import instance from "./index";

function getInvoices(contract_id) {
  // console.log("get invoices for tenant: ", tenant_id);
  if (contract_id) {
    return instance.get(`/api/invoices/?contract=${contract_id}`);
  } else {
    return instance.get("/api/invoices/");
  }
}

function getInvoiceDetails(invoice_id) {
  return instance.get(`/api/invoices/${invoice_id}/`);
}

function addInvoice(invoice) {
  console.log(`Adding invoice`);
  console.log(invoice);
  return instance.post(`/api/invoices/add/`, invoice);
}

// function getUnitsList(property_id) {
//   return instance.get(`/api/units/${property_id}/`);
// }

// function getPropertyOverview(property_id) {
//   // console.log(`Property Overview: ${property_id} called`);
//   return instance.get(`/api/properties/${property_id}/`);
// }

export default { getInvoices, getInvoiceDetails, addInvoice };
