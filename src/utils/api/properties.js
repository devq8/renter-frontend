// import axios from "axios";
import instance from "./index";

function getProperties() {
  return instance.get("/api/properties/");
}

function getUnitsList(property_id, vacant) {
  console.log("get units list called");
  // if (vacant) {
  //   return instance.get(`/api/units/${property_id}/?vacant=${vacant}`);
  // } else {
  return instance.get(`/api/units/${property_id}/`);
  // }
}

function getPropertyOverview(property_id) {
  // console.log(`Property Overview: ${property_id} called`);
  return instance.get(`/api/properties/${property_id}/`);
}

// ######################### Add ###########################
function addProperty(property) {
  console.log(`Adding property`);
  console.log(property);
  return instance.post("/api/properties/add/", property);
}

export default {
  getProperties,
  getUnitsList,
  getPropertyOverview,
  addProperty,
};
