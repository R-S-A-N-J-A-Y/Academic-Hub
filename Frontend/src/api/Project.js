/* eslint-disable no-useless-catch */
import { axiosInstance } from "./axiosInstance";

class Project {
  // Get all projects
  static async getAllProjects() {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/projects");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get my projects
  static async getMyProjects() {
    try {
      const response = await axiosInstance.get("/projects/my");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get projects where I am the guide (faculty)
  static async getMyGuidedProjects() {
    try {
      const response = await axiosInstance.get("/projects/guided/my");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get project details
  static async getProjectDetails(projectId) {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create project
  static async createProject(projectData) {
    try {
      const response = await axiosInstance.post("/projects", projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update project
  static async updateProject(projectId, projectData) {
    try {
      const response = await axiosInstance.put(
        `/projects/${projectId}`,
        projectData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete project
  static async deleteProject(projectId) {
    try {
      const response = await axiosInstance.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get available guides
  static async getAvailableGuides({ dept_id }) {
    try {
      const response = await axiosInstance.get(`/projects/guides/${dept_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Assign guide to project
  static async assignGuide(projectId, guideId) {
    try {
      const response = await axiosInstance.post(
        `/projects/${projectId}/assign-guide`,
        {
          guideId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get full project details
  static async getFullProjectDetails(projectId) {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/details`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update project with full fields
  static async updateProjectFull(projectId, projectData) {
    try {
      const response = await axiosInstance.put(
        `/projects/${projectId}/full`,
        projectData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload project review
  static async uploadReview(projectId, fileUrl) {
    try {
      const response = await axiosInstance.post(
        `/projects/${projectId}/reviews`,
        { file_url: fileUrl }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Like project
  static async likeProject(projectId) {
    try {
      const response = await axiosInstance.post(`/projects/${projectId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Project;
