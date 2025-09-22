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

  static async getMentorStats(mentorId) {
    try {
      const res = await axiosInstance.get(`/mentors/${mentorId}/stats`);
      return res.data;
    } catch (err) {
      console.error("Error fetching mentor stats:", err);
      throw err;
    }
  }
}

export default Faculty;
