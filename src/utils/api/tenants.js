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
  console.log("Im inside updateTenant function");
  console.log("New tenant data:", tenant);

  try {
    console.log("Update tenant", tenant);
    return instance.patch(`/api/tenants/${id}/update/`, tenant);
  } catch (error) {
    console.log("error", error);
  }
}

export function addTenant(formData, uid) {
  // Check and delete email if necessary
  const email = formData.get("email");
  if (!email || email.trim() === "") {
    formData.delete("email");
  }

  console.log("Creating new tenant using these data:", formData);

  return instance.post(`/api/auth/signup/tenant/${uid}/`, formData);
}
