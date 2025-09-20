import { axiosInstance } from "./axiosInstance";

class Auth {
  static async register(payload) {
    return axiosInstance.post("/auth/register", payload);
  }

  static async Login(payload) {
    return axiosInstance.post("/auth/login", payload);
  }

  static async Logout() {
    return axiosInstance.post("/auth/logout");
  }
}

export default Auth;
