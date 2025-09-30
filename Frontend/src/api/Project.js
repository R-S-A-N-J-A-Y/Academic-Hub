import { axiosInstance } from "./axiosInstance";

class Project {
  // Get all projects
  static async getAllProjects() {
    const response = await axiosInstance.get("/projects");
    return response.data;
  }

  //Get Project By Department
  static async getAllProjectsByDepartment(departmentId) {
    const response = await axiosInstance.get("/projects?");
    return response.data;
  }

  // Get my projects
  static async getMyProjects() {
    const response = await axiosInstance.get("/projects/my");
    return response.data;
  }

  // Get projects where I am the guide (faculty)
  static async getMyGuidedProjects() {
    const response = await axiosInstance.get("/projects/guided/my");
    return response.data;
  }

  // Get project details
  static async getProjectDetails(projectId) {
    const response = await axiosInstance.get(`/projects/${projectId}`);
    return response.data;
  }

  // Create project
  static async createProject(projectData) {
    const response = await axiosInstance.post("/projects", projectData);
    return response.data;
  }

  // Update project
  static async updateProject(projectId, projectData) {
    const response = await axiosInstance.put(
      `/projects/${projectId}`,
      projectData
    );
    return response.data;
  }

  // Delete project
  static async deleteProject(projectId) {
    const response = await axiosInstance.delete(`/projects/${projectId}`);
    return response.data;
  }

  // Get available guides
  static async getAvailableGuides({ dept_id }) {
    const response = await axiosInstance.get(`/projects/guides/${dept_id}`);
    return response.data;
  }

  // Assign guide to project
  static async assignGuide(projectId, guideId) {
    const response = await axiosInstance.post(
      `/projects/${projectId}/assign-guide`,
      {
        guideId,
      }
    );
    return response.data;
  }

  // Get full project details
  static async getFullProjectDetails(projectId) {
    const response = await axiosInstance.get(`/projects/${projectId}/details`);
    return response.data;
  }

  // Update project with full fields
  static async updateProjectFull(projectId, projectData) {
    const response = await axiosInstance.put(
      `/projects/${projectId}/full`,
      projectData
    );
    return response.data;
  }

  // Upload project review
  static async uploadReview(projectId, fileUrl) {
    const response = await axiosInstance.post(
      `/projects/${projectId}/reviews`,
      { file_url: fileUrl }
    );
    return response.data;
  }

  // Like project
  static async likeProject(projectId) {
    const response = await axiosInstance.post(`/projects/${projectId}/like`);
    return response.data;
  }

  // Get student dashboard statistics
  static async getStudentStats() {
    const response = await axiosInstance.get(`/projects/my/stats`);
    return response.data;
  }
}

export default Project;
