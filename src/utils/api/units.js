// import axios from "axios";
import instance from "./index";

// ######################### Add ###########################
function addUnit(unit, propertyId) {
  console.log(`Adding unit`);
  console.log(unit);
  return instance.post(`/api/units/${propertyId}/add/`, unit);
}

function listUnit(vacant) {
  if (vacant) {
    return instance.get(`/api/units/?vacant=${vacant}`);
  } else {
    return instance.get(`/api/units/`);
  }
}

export default {
  addUnit,
  listUnit,
};
