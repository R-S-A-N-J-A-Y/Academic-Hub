const projectController = require("../Controllers/projectController");
const teamController = require("../Controllers/teamController");
const guideController = require("../Controllers/guideController");

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await projectController.getAllProjects();

    res.status(200).json({
      success: true,
      data: projects,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get my projects
const getMyProjects = async (req, res) => {
  try {
    const { user_id } = req.user;
    const projects = await projectController.getMyProjects(user_id);

    res.status(200).json({
      success: true,
      data: projects,
      message: "My projects fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching my projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create project
const createProject = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { 
      title, 
      abstract, 
      projectType, 
      teamName, 
      teamMembers, 
      guideId,
      objective,
      category,
      hosted_link,
      visibility = 'public'
    } = req.body;

    // Validate required fields
    if (!title || !abstract) {
      return res.status(400).json({
        success: false,
        message: "Title and abstract are required",
      });
    }

    // Get user's batch and department info
    const userInfo = await projectController.getUserBatchAndDept(user_id);
    if (!userInfo) {
      return res.status(400).json({
        success: false,
        message: "User must be a student to create projects",
      });
    }

    // Create project
    const project = await projectController.createProject({
      title,
      abstract,
      type: projectType,
      created_by: user_id,
      batch_id: userInfo.batch_id,
      dept_id: userInfo.dept_id,
      guide_id: guideId ?? null,
      objective: objective ?? null,
      category: category ?? 'mini',       // only default if undefined
      hosted_link: hosted_link ?? null,
      visibility,
    });

    let team = null;

    // Handle team creation if projectType is 'team'
    if (projectType === "team") {
      if (!teamName) {
        return res.status(400).json({
          success: false,
          message: "Team name is required for team projects",
        });
      }

      if (!teamMembers || teamMembers.length < 2 || teamMembers.length > 4) {
        return res.status(400).json({
          success: false,
          message: "Team must have 2-4 members",
        });
      }

      // Validate team members
      const validMembers = await teamController.validateTeamMembers(
        teamMembers,
        user_id
      );

      // Create team
      team = await teamController.createTeam(
        project.project_id,
        teamName,
        user_id,
        guideId ?? null
      );

      // Add team members
      for (const member of validMembers) {
        await teamController.addTeamMember(
          team.team_id,
          member.user_id,
          "member"
        );
      }
    }

    // Get complete project details
    const projectDetails = await projectController.getProjectDetails(
      project.project_id
    );
    const teamMembersList =
      projectType === "team"
        ? await projectController.getTeamMembers(project.project_id)
        : [];

    res.status(201).json({
      success: true,
      data: {
        project: projectDetails,
        team: team,
        teamMembers: teamMembersList,
      },
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create project",
    });
  }
};


// Update project
const updateProject = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { projectId } = req.params;
    const { title, abstract } = req.body;

    const updatedProject = await projectController.updateProject(
      projectId,
      {
        title,
        abstract,
      },
      user_id
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update project",
    });
  }
};

// Get project details
const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await projectController.getProjectDetails(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const teamMembers = await projectController.getTeamMembers(projectId);
    const guideAssignments = project.team_id
      ? await guideController.getGuideAssignments(project.team_id)
      : [];

    res.status(200).json({
      success: true,
      data: {
        project,
        teamMembers,
        guideAssignments,
      },
      message: "Project details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get available guides
const getAvailableGuides = async (req, res) => {
  try {
    const { dept_id } = req.params; // get dept_id from query params
    if (!dept_id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    const guides = await guideController.getAvailableGuides(dept_id);

    res.status(200).json({
      success: true,
      data: guides,
      message: "Guides fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Assign guide to team
const assignGuideToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { guideId } = req.body;

    if (!guideId) {
      return res.status(400).json({
        success: false,
        message: "Guide ID is required",
      });
    }

    const assignment = await guideController.assignGuideToTeam(teamId, guideId);

    res.status(201).json({
      success: true,
      data: assignment,
      message: "Guide assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning guide:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to assign guide",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { projectId } = req.params;

    const deletedProject = await projectController.deleteProject(
      projectId,
      user_id
    );

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedProject,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete project",
    });
  }
};

// Get full project details with permissions check
const getFullProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { user_id } = req.user;

    // Check if user can view this project
    const canView = await projectController.canViewProject(projectId, user_id);
    if (!canView) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this project",
      });
    }

    // Get project details
    const project = await projectController.getFullProjectDetails(projectId, user_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get team members
    const teamMembers = await projectController.getTeamMembers(projectId);

    // Get reviews
    const reviews = await projectController.getProjectReviews(projectId);

    res.status(200).json({
      success: true,
      data: {
        project: {
          project_id: project.project_id,
          title: project.title,
          abstract: project.abstract,
          objective: project.objective,
          category: project.category,
          status: project.status,
          type: project.type,
          hosted_link: project.hosted_link,
          visibility: project.visibility,
          likes: project.likes,
          department: project.department,
          batch_name: project.batch_name,
          team_name: project.team_name,
          created_by: {
            name: project.created_by_name,
            email: project.created_by_email,
          },
          guide: project.guide_name ? {
            name: project.guide_name,
            email: project.guide_email,
          } : null,
          team_members: teamMembers.map(member => ({
            user_id: member.user_id,
            name: member.name,
            email: member.email,
            role_in_team: member.role_in_team,
          })),
          reviews: reviews.map(review => ({
            review_number: review.review_number,
            file_url: review.file_url,
            created_at: review.created_at,
          })),
          created_at: project.created_at,
          updated_at: project.updated_at,
        },
      },
      message: "Project details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching full project details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update project with new fields
const updateProjectFull = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { projectId } = req.params;
    const { title, abstract, objective, category, status, hosted_link, visibility } = req.body;

    const updatedProject = await projectController.updateProjectFull(
      projectId,
      { title, abstract, objective, category, status, hosted_link, visibility },
      user_id
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update project",
    });
  }
};

// Upload project review
const uploadProjectReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { file_url } = req.body;

    if (!file_url) {
      return res.status(400).json({
        success: false,
        message: "File URL is required",
      });
    }

    const review = await projectController.addProjectReview(projectId, file_url);

    res.status(201).json({
      success: true,
      data: review,
      message: "Review uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading review:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to upload review",
    });
  }
};

// Like project
const likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await projectController.likeProject(projectId);

    res.status(200).json({
      success: true,
      data: { likes: result.likes },
      message: "Project liked successfully",
    });
  } catch (error) {
    console.error("Error liking project:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to like project",
    });
  }
};

module.exports = {
  getAllProjects,
  getMyProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getAvailableGuides,
  assignGuideToTeam,
  deleteProject,
  getFullProjectDetails,
  updateProjectFull,
  uploadProjectReview,
  likeProject,
};
