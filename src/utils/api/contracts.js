// import axios from "axios";
import instance from "./index";

function getContracts() {
  return instance.get("/api/contracts/");
}

function getContractDetails(contract_id) {
  return instance.get(`/api/contracts/${contract_id}/`);
}

function addContract(contract) {
  return instance.post(`/api/contracts/add/`, contract);
}

// function getPropertyOverview(property_id) {
//   // console.log(`Property Overview: ${property_id} called`);
//   return instance.get(`/api/properties/${property_id}/`);
// }

export default { getContracts, getContractDetails, addContract };
