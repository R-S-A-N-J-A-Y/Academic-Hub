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

  static async getAllFaculties(deptId) {
    try {
      const res = await axiosInstance.get(`/faculty/all/${deptId}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching all faculties:", err);
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

  static async updateGuideStatus(ids, isGuide) {
    try {
      const res = await axiosInstance.patch(`/faculty/isguide`, {
        ids,
        isGuide,
      });
      return res.data;
    } catch (err) {
      console.error("Error updating guide status:", err);
      throw err;
    }
  }
}

export default Faculty;
