// import axios from "axios";
import instance from "./index";

export function getProperties() {
  return instance.get("/api/properties/");
}

export function getUnitsList(property_id, vacant) {
  // if (vacant) {
  //   return instance.get(`/api/units/${property_id}/?vacant=${vacant}`);
  // } else {
  return instance.get(`/api/units/${property_id}/`);
  // }
}

export function getPropertyOverview(property_id) {
  return instance.get(`/api/properties/${property_id}/`);
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
