const storage = {
  getToken: () => JSON.parse(localStorage.getItem("token") || "null"),
  setToken: (token) => localStorage.setItem("token", JSON.stringify(token)),
  clearToken: () => localStorage.removeItem("token"),
};

export default storage;
