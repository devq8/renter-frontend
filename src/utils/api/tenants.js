// import axios from "axios";
import instance from "./index";

function getTenants() {
  return instance.get("/api/tenants");
}

function addTenant(tenant) {
  console.log("Adding tenant :", tenant);
  if (!tenant.email || tenant.email.trim() === "") {
    delete tenant.email;
  }
  return instance.post("/api/auth/signup/", tenant);
}

export default { getTenants, addTenant };
