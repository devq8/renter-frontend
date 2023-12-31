// import axios from "axios";
import instance from "./index";

function getProperties() {
  return instance.get("/api/properties/");
}

function getUnitsList(property_id, vacant) {
  // if (vacant) {
  //   return instance.get(`/api/units/${property_id}/?vacant=${vacant}`);
  // } else {
  return instance.get(`/api/units/${property_id}/`);
  // }
}

function getPropertyOverview(property_id) {
  return instance.get(`/api/properties/${property_id}/`);
}

// ######################### Add ###########################
function addProperty(property) {
  return instance.post("/api/properties/add/", property);
}

// ######################### Update ###########################
function updateProperty(property, id) {
  try {
    return instance.patch(`/api/properties/${id}/update/`, property);
  } catch (error) {
    console.log("error", error);
  }
}

export default {
  getProperties,
  getUnitsList,
  getPropertyOverview,
  addProperty,
  updateProperty,
};
