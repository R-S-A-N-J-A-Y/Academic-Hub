import { axiosInstance } from "../api/axiosInstance";

class User {
  static async getProfile() {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await axiosInstance.put("/user/change-password", {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default User;
