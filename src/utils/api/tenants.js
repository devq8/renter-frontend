// import axios from "axios";
import instance from "./index";

function getTenants() {
  return instance.get("/api/tenants");
}

export default { getTenants };
