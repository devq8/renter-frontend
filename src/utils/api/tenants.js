import instance from "./index";

export function getTenants(tenant_id) {
  if (tenant_id) {
    // if tenant id is provided, get the tenant details
    return instance.get(`/api/tenants/${tenant_id}/`);
  } else {
    // if tenant id is not provided, get list of all tenants
    return instance.get("/api/tenants/");
  }
}

export function updateTenant(tenant, id) {
  try {
    return instance.patch(`/api/tenants/${id}/update/`, tenant);
  } catch (error) {
    console.log("error", error);
  }
}

export function addTenant(formData, uid) {
  console.log("I'm in addTenant function trying to upload tenant details");

  // Check and delete email if necessary
  const email = formData.get("email");
  if (!email || email.trim() === "") {
    formData.delete("email");
  }

  return instance.post(`/api/auth/signup/tenant/${uid}/`, formData);
}
