import { configureAuth } from "react-query-auth";
import instance from "../api";
import storage from "../storage";
import jwt_decode from "jwt-decode";

const { useUser, useLogin, useRegister, useLogout, AuthLoader } = configureAuth(
  {
    userFn: () => {
      // YOUR FUNCTION THAT GETS THE USER GOES HERE
      // is token?
      // YES 1) check token expiration
      //     2) if expired, return null
      //     3) if not expired, return user
      const token = storage.getToken();
      if (token) {
        const decoded = jwt_decode(token);

        if (decoded.exp < Date.now() / 1000) {
          storage.clearToken();
          return null;
        }
        return decoded;
      }
      return null;
    },
    loginFn: async (credentials) => {
      // YOU FUNCTION FOR LOGIN HERE
      const response = await instance.post("api/auth/signin/", credentials);
      const token = response.data.token;
      storage.setToken(token);
      console.log(response);
    },
    registerFn: async (credentials) => {
      // YOUR FUNCTION FOR SIGNUP HERE
      const response = await instance.post("api/auth/signup", credentials);
      const token = response.data.token;
      storage.setToken(token);
    },
    logoutFn: () => {
      // YOUR FUNCTION FOR LOGOUT HERE
      storage.clearToken();
    },
  }
);
export { useUser, useLogin, useRegister, useLogout, AuthLoader };
