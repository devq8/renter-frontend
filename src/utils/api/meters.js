import instance from "./index";

export function getMeters({ building = null } = {}) {
  let url = "/api/meters/list";
  let queryParams = [];

  if (building) queryParams.push(`building=${building}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }
  console.log("Url in getMeters:", url);
  return instance.get(url);
}
