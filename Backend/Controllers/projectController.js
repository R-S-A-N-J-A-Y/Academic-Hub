const pool = require("../db/dbConfig");

// Get all projects
const getAllProjects = async () => {
  const query = `
    SELECT 
      p.*,  -- all columns from projects
      COALESCE(p.guide_status, 'NA') AS guide_status,
      u.name AS created_by_name,
      u.email AS created_by_email,
      b.batch_name,
      d.dept_name AS department,
      t.team_name,
      g.name AS guide_name,
      g.email AS guide_email
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.user_id
    LEFT JOIN batches b ON p.batch_id = b.batch_id
    LEFT JOIN department d ON p.dept_id = d.dept_id
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN faculty f ON p.guide_id = f.user_id
    LEFT JOIN users g ON f.user_id = g.user_id
    ORDER BY p.created_at DESC;

  `;

  const result = await pool.query(query);
  return result.rows;
};

const getAllProjectsByDepartment = async (dept_id) => {
  const query = `
    SELECT * FROM projects WHERE dept_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [dept_id]);
  return result.rows;
}

// Get projects created by or assigned to a user
const getMyProjects = async (userId) => {
  const query = `
    SELECT DISTINCT ON (p.project_id)
  p.project_id,
  p.title,
  p.abstract,
  p.type,
  p.category,
  p.visibility,
  p.status,
  COALESCE(p.guide_status, 'NA') AS guide_status,
  p.created_at,
  p.updated_at,
  u.name AS created_by_name,
  u.email AS created_by_email,
  b.batch_name,
  d.dept_name AS department,
  t.team_name,
  tm.role_in_team AS my_role,
  g.name AS guide_name,
  g.email AS guide_email
FROM projects p
LEFT JOIN users u ON p.created_by = u.user_id
LEFT JOIN batches b ON p.batch_id = b.batch_id
LEFT JOIN department d ON p.dept_id = d.dept_id
LEFT JOIN teams t ON p.project_id = t.project_id
LEFT JOIN team_members tm ON t.team_id = tm.team_id
LEFT JOIN faculty f ON p.guide_id = f.user_id
LEFT JOIN users g ON f.user_id = g.user_id
WHERE p.created_by = $1 OR tm.user_id = $1
ORDER BY p.project_id, p.created_at DESC;

  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Get projects where the user is the assigned guide
const getGuidedProjects = async (userId) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.abstract,
  p.type,
  p.category,
      p.visibility,
      p.status,
      COALESCE(p.guide_status, 'NA') AS guide_status,
      p.created_at,
      p.updated_at,
      u.name AS created_by_name,
      u.email AS created_by_email,
      b.batch_name,
      d.dept_name AS department,
      t.team_name,
      g.name AS guide_name,
      g.email AS guide_email
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.user_id
    LEFT JOIN batches b ON p.batch_id = b.batch_id
    LEFT JOIN department d ON p.dept_id = d.dept_id
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN faculty f ON p.guide_id = f.user_id
    LEFT JOIN users g ON f.user_id = g.user_id
    WHERE p.guide_id = $1
    ORDER BY p.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Create project
const createProject = async ({
  title,
  abstract,
  type,
  created_by,
  batch_id,
  dept_id,
  guide_id,
  objective,
  category,
  hosted_link,
  visibility = "public",
}) => {
  // Determine status based on guide assignment
  const status = guide_id ? "pending" : "new";

  const query = `
    INSERT INTO projects 
      (title, abstract, type, created_by, batch_id, dept_id, guide_id, status, objective, category, hosted_link, visibility, likes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `;
  const values = [
    title,
    abstract,
    type,
    created_by,
    batch_id,
    dept_id,
    guide_id,
    status,
    objective ?? null,
    category ?? "mini",
    hosted_link ?? null,
    visibility,
    0, // default likes
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Update project
const updateProject = async (projectId, { title, abstract }, userId) => {
  // Check permission
  const checkQuery = `
    SELECT p.created_by, tm.user_id
    FROM projects p
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN team_members tm ON t.team_id = tm.team_id
    WHERE p.project_id = $1 AND (p.created_by = $2 OR tm.user_id = $2)
  `;
  const checkResult = await pool.query(checkQuery, [projectId, userId]);
  if (!checkResult.rows.length)
    throw new Error("Unauthorized to update this project");

  // Check status
  const statusResult = await pool.query(
    `SELECT status FROM projects WHERE project_id = $1`,
    [projectId]
  );
  if (["approved", "in-progress"].includes(statusResult.rows[0].status)) {
    throw new Error("Cannot edit approved or in-progress projects");
  }

  const updateQuery = `
    UPDATE projects 
    SET title = $1, abstract = $2, updated_at = CURRENT_TIMESTAMP
    WHERE project_id = $3
    RETURNING *;
  `;
  const result = await pool.query(updateQuery, [title, abstract, projectId]);
  return result.rows[0];
};

// Get project details
const getProjectDetails = async (projectId) => {
  const query = `
    SELECT 
      p.*,
      u.name AS created_by_name,
      u.email AS created_by_email,
      b.batch_name,
      d.dept_name AS department,
      t.team_name,
      t.team_id,
      g.name AS guide_name,
      g.email AS guide_email,
      p.category AS project_type,
      p.objective,
      p.hosted_link,
      p.visibility,
      p.likes,
      p.paper_link,
      p.conference_name,
      p.conference_year,
      p.conference_status,
      p.ispublished,
      p.created_at,
      p.updated_at,
      COALESCE(p.guide_status, 'NA') AS guide_status -- show NA if no guide
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.user_id
    LEFT JOIN batches b ON p.batch_id = b.batch_id
    LEFT JOIN department d ON p.dept_id = d.dept_id
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN faculty f ON p.guide_id = f.user_id
    LEFT JOIN users g ON f.user_id = g.user_id
    WHERE p.project_id = $1;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};

// Get team members for a project
const getTeamMembers = async (projectId) => {
  const query = `
    SELECT tm.role_in_team, u.user_id, u.name, u.email
    FROM teams t
    JOIN team_members tm ON t.team_id = tm.team_id
    JOIN users u ON tm.user_id = u.user_id
    WHERE t.project_id = $1
    ORDER BY tm.role_in_team DESC;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};

// Get user's batch and department info
const getUserBatchAndDept = async (userId) => {
  const query = `
    SELECT s.batch_id, s.dept_id, b.batch_name, d.dept_name
    FROM students s
    JOIN batches b ON s.batch_id = b.batch_id
    JOIN department d ON s.dept_id = d.dept_id
    WHERE s.user_id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

// Get faculty department for project creation by faculty
const getFacultyDept = async (userId) => {
  const query = `
    SELECT f.dept_id, d.dept_name
    FROM faculty f
    JOIN department d ON f.dept_id = d.dept_id
    WHERE f.user_id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

const deleteProject = async (projectId, userId) => {
  // Only the original creator may delete the project, and only if they are a student
  const checkQuery = `
    SELECT p.created_by
    FROM projects p
    WHERE p.project_id = $1
  `;
  const checkResult = await pool.query(checkQuery, [projectId]);

  if (!checkResult.rows.length) {
    throw new Error("Project not found");
  }

  const creatorId = checkResult.rows[0].created_by;
  if (creatorId !== userId) {
    throw new Error("Unauthorized to delete this project");
  }

  // Delete project
  const deleteQuery = `
    DELETE FROM projects
    WHERE project_id = $1
    RETURNING *;
  `;
  const result = await pool.query(deleteQuery, [projectId]);

  return result.rows[0];
};

// Get full project details with all related data
const getFullProjectDetails = async (projectId, userId = null) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.abstract,
      p.objective,
      p.category,
      p.status,
      p.type,
      p.hosted_link,
      p.visibility,
      p.likes,
      COALESCE(p.ispublished, false) AS ispublished,
      p.paper_link,
      p.conference_name,
      p.conference_year,
      p.conference_status,
      p.created_by,
      p.guide_id,
      p.guide_status,
      p.created_at,
      p.updated_at,
      u.name AS created_by_name,
      u.email AS created_by_email,
      b.batch_name,
      d.dept_name AS department,
      t.team_name,
      t.team_id,
      g.name AS guide_name,
      g.email AS guide_email
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.user_id
    LEFT JOIN batches b ON p.batch_id = b.batch_id
    LEFT JOIN department d ON p.dept_id = d.dept_id
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN faculty f ON p.guide_id = f.user_id
    LEFT JOIN users g ON f.user_id = g.user_id
    WHERE p.project_id = $1;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};

// Get project reviews
const getProjectReviews = async (projectId) => {
  const query = `
    SELECT 
      review_id,
      project_id,
      review_number,
      file_url,
      created_at
    FROM project_reviews
    WHERE project_id = $1
    ORDER BY review_number ASC;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};

// Check if user can view project (permissions)
const canViewProject = async (projectId, userId) => {
  const query = `
    SELECT 
      p.visibility,
      p.created_by,
      tm.user_id as team_member_id,
      p.guide_id
    FROM projects p
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN team_members tm ON t.team_id = tm.team_id AND tm.user_id = $2
    WHERE p.project_id = $1;
  `;
  const result = await pool.query(query, [projectId, userId]);

  if (!result.rows.length) return false;

  const project = result.rows[0];

  // Public projects can be viewed by anyone
  if (project.visibility === "public") return true;

  // Private projects can only be viewed by creator, team members, or guide
  return (
    project.created_by === userId ||
    project.team_member_id === userId ||
    project.guide_id === userId
  );
};

// Update project with new fields
const updateProjectFull = async (projectId, updateData, userId) => {
  // Check permission (creator or any team member)
  const permissionQuery = `
    SELECT p.created_by, tm.user_id
    FROM projects p
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN team_members tm ON t.team_id = tm.team_id
    WHERE p.project_id = $1 AND (p.created_by = $2 OR tm.user_id = $2)
  `;
  const permissionResult = await pool.query(permissionQuery, [
    projectId,
    userId,
  ]);

  if (!permissionResult.rows.length) {
    throw new Error("Unauthorized to update this project");
  }

  // Check current status - only allow editing if not in final states
  const statusResult = await pool.query(
    `SELECT status FROM projects WHERE project_id = $1`,
    [projectId]
  );
  const currentStatus = statusResult.rows[0].status;

  // Allow status updates only if current status is not 'completed'
  // If updating status to 'completed', allow it regardless
  if (
    updateData.status &&
    updateData.status !== "completed" &&
    currentStatus === "completed"
  ) {
    throw new Error("Cannot edit completed projects");
  }

  const {
    title,
    abstract,
    objective,
    category,
    status,
    hosted_link,
    visibility,
    ispublished,
    paper_link,
    conference_name,
    conference_year,
    conference_status,
  } = updateData;

  // Normalize values to avoid invalid casts (e.g., empty string to integer)
  const normalizedIsPublished =
    typeof ispublished === "boolean"
      ? ispublished
      : ispublished === undefined
      ? null
      : Boolean(ispublished);
  const normalizedPaperLink = paper_link === "" ? null : paper_link ?? null;
  const normalizedConferenceName =
    conference_name === "" ? null : conference_name ?? null;
  const normalizedConferenceYear =
    conference_year === "" ||
    conference_year === undefined ||
    conference_year === null
      ? null
      : Number(conference_year);
  const normalizedConferenceStatus =
    conference_status === "" ? null : conference_status ?? null;

  const updateQuery = `
    UPDATE projects 
    SET 
      title = COALESCE($1, title),
      abstract = COALESCE($2, abstract),
      objective = COALESCE($3, objective),
      category = COALESCE($4, category),
      status = COALESCE($5, status),
      hosted_link = COALESCE($6, hosted_link),
      visibility = COALESCE($7, visibility),
      ispublished = COALESCE($8, ispublished),
      paper_link = COALESCE($9, paper_link),
      conference_name = COALESCE($10, conference_name),
      conference_year = COALESCE($11, conference_year),
      conference_status = COALESCE($12, conference_status),
      updated_at = CURRENT_TIMESTAMP
    WHERE project_id = $13
    RETURNING *;
  `;

  const result = await pool.query(updateQuery, [
    title,
    abstract,
    objective,
    category,
    status,
    hosted_link,
    visibility,
    normalizedIsPublished,
    normalizedPaperLink,
    normalizedConferenceName,
    normalizedConferenceYear,
    normalizedConferenceStatus,
    projectId,
  ]);

  return result.rows[0];
};

// Add project review
const addProjectReview = async (projectId, fileUrl) => {
  // Get next review number
  const reviewNumberQuery = `
    SELECT COALESCE(MAX(review_number), 0) + 1 as next_review_number
    FROM project_reviews
    WHERE project_id = $1;
  `;
  const reviewNumberResult = await pool.query(reviewNumberQuery, [projectId]);
  const nextReviewNumber = reviewNumberResult.rows[0].next_review_number;

  const insertQuery = `
    INSERT INTO project_reviews (project_id, review_number, file_url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, [
    projectId,
    nextReviewNumber,
    fileUrl,
  ]);
  return result.rows[0];
};

// Like project
const likeProject = async (projectId) => {
  const updateQuery = `
    UPDATE projects 
    SET likes = likes + 1
    WHERE project_id = $1
    RETURNING likes;
  `;

  const result = await pool.query(updateQuery, [projectId]);
  return result.rows[0];
};

// Get student-specific statistics: total projects, published count, in-progress count, teams participated
const getStudentStats = async (userId) => {
  const query = `
    SELECT
      (SELECT COUNT(DISTINCT p.project_id)
       FROM projects p
       LEFT JOIN teams t ON p.project_id = t.project_id
       LEFT JOIN team_members tm ON t.team_id = tm.team_id
       WHERE p.created_by = $1 OR tm.user_id = $1) AS total_projects,
      (SELECT COUNT(DISTINCT p.project_id)
       FROM projects p
       LEFT JOIN teams t ON p.project_id = t.project_id
       LEFT JOIN team_members tm ON t.team_id = tm.team_id
       WHERE (p.created_by = $1 OR tm.user_id = $1) AND COALESCE(p.ispublished, false) = true) AS published_projects,
      (SELECT COUNT(DISTINCT p.project_id)
       FROM projects p
       LEFT JOIN teams t ON p.project_id = t.project_id
       LEFT JOIN team_members tm ON t.team_id = tm.team_id
       WHERE (p.created_by = $1 OR tm.user_id = $1) AND p.status = 'in-progress') AS in_progress_projects,
      (SELECT COUNT(DISTINCT t.team_id)
       FROM teams t
       JOIN team_members tm ON t.team_id = tm.team_id
       WHERE tm.user_id = $1) AS teams_participated
  `;

  const result = await pool.query(query, [userId]);
  return (
    result.rows[0] || {
      total_projects: 0,
      published_projects: 0,
      in_progress_projects: 0,
      teams_participated: 0,
    }
  );
};

module.exports = {
  getAllProjects,
  getMyProjects,
  getGuidedProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getTeamMembers,
  getUserBatchAndDept,
  getFacultyDept,
  deleteProject,
  getFullProjectDetails,
  getProjectReviews,
  canViewProject,
  updateProjectFull,
  addProjectReview,
  likeProject,
  getStudentStats,
  getAllProjectsByDepartment
};
