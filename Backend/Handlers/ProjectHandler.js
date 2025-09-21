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
    const { title, abstract, projectType, teamName, teamMembers, guideId } =
      req.body;

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
      guide_id: guideId || null,
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
        guideId || null
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

module.exports = {
  getAllProjects,
  getMyProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getAvailableGuides,
  assignGuideToTeam,
  deleteProject,
};
