import { axiosInstance } from "./axiosInstance";

class Department {
  static async getAllDepartments() {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/departments");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Department;
