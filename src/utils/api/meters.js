import instance from "./index";

export function getMeters({ contract = null } = {}) {
  let url = "/api/meters/list/";
  if (contract) {
    url += `?contract=${contract}`;
  }
  // console.log("url: ", url);
  // let queryParams = [];

  // if (building) queryParams.push(`building=${building}`);

  // if (queryParams.length > 0) {
  // url += `?${queryParams.join("&")}`;
  // }
  // console.log("Url in getMeters:", url);
  return instance.get(url);
}

export function getMeterDetails(contractId) {
  // console.log("ContractID in getMeterDetails:", contractId);
  return instance.get(`/api/meters/list/${contractId}/`);
}

export function addBulkReadings(readings) {
  console.log("Readings in addBulkReadings function:", readings);
  return instance.post("/api/meters/bulk-meter-readings/", readings);
}
