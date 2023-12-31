// import axios from "axios";
import instance from "./index";

// ######################### Add ###########################
function addUnit(unit, propertyId) {
  return instance.post(`/api/units/${propertyId}/add/`, unit);
}

function listUnit(vacant) {
  if (vacant) {
    return instance.get(`/api/units/?vacant=${vacant}`);
  } else {
    return instance.get(`/api/units/`);
  }
}

function getUnitDetails(unitId) {
  return instance.get(`/api/units/details/${unitId}/`);
}

function updateUnit(unit, id) {
  try {
    return instance.patch(`/api/units/details/${id}/update/`, unit);
  } catch (error) {
    console.log("Error :", error);
  }
}

export default {
  addUnit,
  listUnit,
  getUnitDetails,
  updateUnit,
};
