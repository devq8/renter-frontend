import axios from "axios";
import storage from "../storage";

// Helper function to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Error parsing JWT", e);
    return null;
  }
}

// Helper function to check token expiry
function isTokenExpired(token) {
  const decoded = parseJwt(token);
  if (!decoded) return true; // Assume expired or invalid if not able to decode

  const now = Date.now().valueOf() / 1000;
  // Check if the token expiry time ('exp') is in the past
  if (typeof decoded.exp !== "undefined" && decoded.exp < now) {
    console.warn("Token has expired");
    return true;
  }
  // Optionally, check if the token was issued before a certain time ('iat')
  if (typeof decoded.iat !== "undefined" && decoded.iat > now) {
    console.warn("Token not yet valid");
    return true;
  }

  return false;
}

const isDevelopment = process.env.NODE_ENV === "development";
const baseURL = isDevelopment
  ? "http://127.0.0.1:8000"
  : "https://admin.wuc.com.kw";

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(
  function (config) {
    // Add token with each request
    const token = storage.getToken();

    if (token) {
      // If token is available

      // Log the token's decoded payload for debugging
      const decodedToken = parseJwt(token);
      // console.log("Decoded JWT:", decodedToken);

      if (isTokenExpired(token)) {
        // If token is expired
        console.warn("Attempting to use an expired token!");
      } else {
        // If token is valid
        console.log(
          "Token is valid. Expiry:",
          new Date(decodedToken.exp * 1000).toLocaleString()
        );

        // Token is availabile and valid, attach it to the request
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // If token is not available
      console.warn("No token found");
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;
