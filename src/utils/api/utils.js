import instance from "./index";

export function getManagers() {
  return instance.get("/api/managers/");
}

export function getOwners() {
  return instance.get("/api/owners/");
}

export function getBanks(language) {
  if (language) {
    return instance.get("/api/banks/?language=" + language);
  } else {
    return instance.get("/api/banks/");
  }
}

export function getAreas(language) {
  if (language) {
    return instance.get("/api/areas/?language=" + language);
  } else {
    return instance.get("/api/areas/");
  }
}

export function getFloors(language) {
  if (language) {
    return instance.get("/api/floors/?language=" + language);
  } else {
    return instance.get("/api/floors/");
  }
}

export function getUnitTypes(language) {
  if (language) {
    return instance.get("/api/unit_types/?language=" + language);
  } else {
    return instance.get("/api/unit_types/");
  }
}

export function getInvoiceTypes(language) {
  if (language) {
    return instance.get("/api/invoice_types/?language=" + language);
  } else {
    return instance.get("/api/invoice_types/");
  }
}

export function getManagerName(uid) {
  return instance.get(`/api/managers/${uid}/`);
}

export function sendContactUs(message) {
  return instance.post("/api/contact/", message);
}

export function sendInvoiceReminder(contractID) {
  return instance.post(`/api/contracts/${contractID}/reminder/`);
}

export function sendOTPCode(mobile) {
  return instance.post("/api/auth/send_verification/", {
    phone: mobile,
  });
}

export function verifyOTPCode(values) {
  console.log(
    `Verifying OTP ${values.code} with mobile number ${values.phone}`
  );
  return instance.post("/api/auth/verify_code/", values);
}

export function sendResetPasswordLink(email) {
  return instance.post(`/api/auth/reset_password/`, { email: email });
}

export function resetPasswordLink(uid, reset_token, new_password) {
  return instance.post(
    `/api/auth/reset_password_confirm/${uid}/${reset_token}/`,
    { new_password: new_password }
  );
}
