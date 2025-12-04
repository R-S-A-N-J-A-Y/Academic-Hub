import { axiosInstance } from "./axiosInstance";

class Student {
  // Search students by email within same department as logged-in student
  static async searchByEmail(query) {
    const response = await axiosInstance.get("/students/search", {
      params: { query },
    });
    return response.data;
  }
}

export default Student;


