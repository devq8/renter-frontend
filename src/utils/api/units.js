// import axios from "axios";
import instance from "./index";
import { fetchAllPages } from "./_normalize";

// ######################### Add ###########################
export function addUnit(unit, propertyId) {
  return instance.post(`/api/units/${propertyId}/add/`, unit);
}

// Paginated list endpoint — return a flat array of all (optionally vacant) units.
export function listUnit(vacant) {
  if (vacant) {
    return fetchAllPages(`/api/units/`, { params: { vacant } });
  } else {
    return fetchAllPages(`/api/units/`);
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
