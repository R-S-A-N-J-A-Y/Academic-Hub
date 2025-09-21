const pool = require("../db/dbConfig");

// Get all projects
const getAllProjects = async () => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.abstract,
      p.type,
      p.status,
      COALESCE(p.guide_status, 'NA') AS guide_status, -- only guide_status defaults to 'NA'
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
    ORDER BY p.created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

// Get projects created by or assigned to a user
const getMyProjects = async (userId) => {
  const query = `
    SELECT DISTINCT
      p.project_id,
      p.title,
      p.abstract,
      p.type,
      p.status,
      COALESCE(p.guide_status, 'NA') AS guide_status, -- only guide_status defaults to 'NA'
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
}) => {
  // Determine status based on guide assignment
  const status = guide_id ? "pending" : "new";

  const query = `
    INSERT INTO projects 
      (title, abstract, type, created_by, batch_id, dept_id, guide_id, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    status, // dynamically set
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

const deleteProject = async (projectId, userId) => {
  // Check if user is authorized (creator or team member)
  const checkQuery = `
    SELECT p.created_by, tm.user_id
    FROM projects p
    LEFT JOIN teams t ON p.project_id = t.project_id
    LEFT JOIN team_members tm ON t.team_id = tm.team_id
    WHERE p.project_id = $1 AND (p.created_by = $2 OR tm.user_id = $2)
  `;
  const checkResult = await pool.query(checkQuery, [projectId, userId]);

  if (!checkResult.rows.length) {
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

module.exports = {
  getAllProjects,
  getMyProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getTeamMembers,
  getUserBatchAndDept,
  deleteProject,
};
