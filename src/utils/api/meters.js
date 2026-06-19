import instance from "./index";

export function getMeters({
  contract = null,
  page = 1,
  pageSize = 10,
  search = "",
} = {}) {
  const params = new URLSearchParams();
  if (contract) params.append("contract", contract);
  if (page) params.append("page", page);
  if (pageSize) params.append("page_size", pageSize); // works if you enable PageNumberPagination.page_size_query_param
  if (search) params.append("search", search); // only if backend supports SearchFilter

  const url = `/api/meters/list/${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  console.log("url: ", url);

  // if (contract) {
  //   url += `?contract=${contract}`;
  // }
  // console.log("url: ", url);
  // let queryParams = [];

  // if (building) queryParams.push(`building=${building}`);

  // if (queryParams.length > 0) {
  // url += `?${queryParams.join("&")}`;
  // }
  // console.log("Url in getMeters:", url);
  return instance.get(url).then((res) => res.data); // return the data object directly
}

export function getMeterDetails(contractId) {
  // console.log("ContractID in getMeterDetails:", contractId);
  return instance
    .get(`/api/meters/list/${contractId}/`)
    .then((res) => res.data);
}

export function addBulkReadings(readings) {
  return instance
    .post("/api/meters/bulk-meter-readings/", readings)
    .then((res) => res.data);
}
