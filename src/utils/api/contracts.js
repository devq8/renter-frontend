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

export default { getContracts, getContractDetails, addContract };
