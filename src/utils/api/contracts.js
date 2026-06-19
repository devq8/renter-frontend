// import axios from "axios";
import instance from "./index";
import { fetchAllPages } from "./_normalize";

// The list endpoint is paginated (DRF PageNumberPagination, PAGE_SIZE 20).
// Walk every page and return a flat array of all contracts.
export function getContracts() {
  return fetchAllPages("/api/contracts/");
}

export function getContractDetails(contract_id) {
  return instance.get(`/api/contracts/${contract_id}/`);
}

export function addContract(contract) {
  return instance.post(`/api/contracts/add/`, contract);
}

export function endContract(contract, data) {
  return instance.post(`/api/contracts/${contract}/ending/`, data);
}

// export default { getContracts, getContractDetails, addContract };
