import axios from "axios";
import storage from "../storage";

const instance = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: "https://admin.wuc.com.kw",
});

instance.interceptors.request.use(
  function (config) {
    // Add token with each request
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;
