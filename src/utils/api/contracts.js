// import axios from "axios";
import instance from "./index";

export function getContracts() {
  return instance.get("/api/contracts/");
}

export function getContractDetails(contract_id) {
  return instance.get(`/api/contracts/${contract_id}/`);
}

export function addContract(contract) {
  return instance.post(`/api/contracts/add/`, contract);
}

// export default { getContracts, getContractDetails, addContract };
