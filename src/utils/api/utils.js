import instance from "./index";

function getManagers() {
  return instance.get("/api/managers/");
}

function getOwners() {
  return instance.get("/api/owners/");
}

function getBanks(language) {
  if (language) {
    return instance.get("/api/banks/?language=" + language);
  } else {
    return instance.get("/api/banks/");
  }
}

function getAreas(language) {
  if (language) {
    return instance.get("/api/areas/?language=" + language);
  } else {
    return instance.get("/api/areas/");
  }
}

function getFloors(language) {
  if (language) {
    return instance.get("/api/floors/?language=" + language);
  } else {
    return instance.get("/api/floors/");
  }
}

function getUnitTypes(language) {
  if (language) {
    return instance.get("/api/unit_types/?language=" + language);
  } else {
    return instance.get("/api/unit_types/");
  }
}

function sendContactUs(message) {
  return instance.post("/api/contact/", message);
}

function sendInvoiceReminder(contractID) {
  return instance.post(`/api/contracts/${contractID}/reminder/`);
}

export default {
  getBanks,
  getManagers,
  getOwners,
  getAreas,
  getFloors,
  getUnitTypes,
  sendContactUs,
  sendInvoiceReminder,
};
