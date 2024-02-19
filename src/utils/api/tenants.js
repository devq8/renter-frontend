// import axios from "axios";
import instance from "./index";

export function getTenants() {
  return instance.get("/api/tenants");
}

export function addTenant(formData, uid) {
  console.log("I'm in addTenant function trying to upload tenant details");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  // Check and delete email if necessary
  const email = formData.get("email");
  if (!email || email.trim() === "") {
    formData.delete("email");
  }

  return instance.post(`/api/auth/signup/tenant/${uid}/`, formData);
}
