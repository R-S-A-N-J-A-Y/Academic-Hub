import { axiosInstance } from "../api/axiosInstance";

class Faculty {
  static async getFaculties(deptId) {
    try {
      const res = await axiosInstance.get(`/faculty/${deptId}`);
      return res.data; 
    } catch (err) {
      console.error("Error fetching faculties:", err);
      throw err;
    }
  }
}

export default Faculty;
