// import axios from "axios";
import instance from "./index";

// ######################### Add ###########################
export function addUnit(unit, propertyId) {
  return instance.post(`/api/units/${propertyId}/add/`, unit);
}

export function listUnit(vacant) {
  if (vacant) {
    return instance.get(`/api/units/?vacant=${vacant}`);
  } else {
    return instance.get(`/api/units/`);
  }
}

export function getUnitDetails(unitId) {
  return instance.get(`/api/units/details/${unitId}/`);
}

export function updateUnit(unit, id) {
  try {
    return instance.patch(`/api/units/details/${id}/update/`, unit);
  } catch (error) {
    console.log("Error :", error);
  }
}
