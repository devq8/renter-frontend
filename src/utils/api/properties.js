// import axios from "axios";
import instance from "./index";
import { fetchAllPages } from "./_normalize";

// Paginated list endpoint — return a flat array of all properties.
export function getProperties() {
  return fetchAllPages("/api/properties/");
}

// Paginated list endpoint — return a flat array of all units for a property.
export function getUnitsList(property_id, vacant) {
  // if (vacant) {
  //   return fetchAllPages(`/api/units/${property_id}/`, { params: { vacant } });
  // } else {
  return fetchAllPages(`/api/units/${property_id}/`);
  // }
}

export function getPropertyOverview(property_id) {
  return instance
    .get(`/api/properties/${property_id}/`)
    .then((res) => res.data);
}

export function addProperty(property) {
  return instance.post("/api/properties/add/", property);
}

export function updateProperty(property, id) {
  try {
    return instance.patch(`/api/properties/${id}/update/`, property);
  } catch (error) {
    console.log("error", error);
  }
}
