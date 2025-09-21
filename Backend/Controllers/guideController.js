const pool = require("../db/dbConfig");

const getAvailableGuides = async (deptId) => {
  const result = await pool.query(`
    SELECT u.user_id, u.name, u.email, f.designation, d.dept_name AS department
    FROM users u
    JOIN faculty f ON u.user_id = f.user_id
    JOIN department d ON f.dept_id = d.dept_id
    WHERE u.role = 'faculty' AND f.dept_id = $1
    ORDER BY u.name ASC
  `, [deptId]);

  return result.rows;
};


const assignGuideToTeam = async (teamId, guideId) => {
  const result = await pool.query(`
    INSERT INTO guide_assignments (team_id, guide_id, status)
    VALUES ($1, $2, 'pending')
    RETURNING *;
  `, [teamId, guideId]);
  return result.rows[0];
};

const updateGuideAssignment = async (teamId, guideId, status) => {
  const result = await pool.query(`
    UPDATE guide_assignments
    SET status = $1
    WHERE team_id = $2 AND guide_id = $3
    RETURNING *;
  `, [status, teamId, guideId]);
  return result.rows[0];
};

const removeGuideAssignment = async (teamId, guideId) => {
  const result = await pool.query(`
    DELETE FROM guide_assignments
    WHERE team_id = $1 AND guide_id = $2
    RETURNING *;
  `, [teamId, guideId]);
  return result.rows[0];
};

const getGuideAssignments = async (teamId) => {
  const result = await pool.query(`
    SELECT ga.assignment_id, ga.status, ga.assigned_on,
      u.user_id AS guide_id, u.name AS guide_name, u.email AS guide_email,
      f.designation
    FROM guide_assignments ga
    JOIN users u ON ga.guide_id = u.user_id
    JOIN faculty f ON u.user_id = f.user_id
    WHERE ga.team_id = $1
    ORDER BY ga.assigned_on DESC
  `, [teamId]);
  return result.rows;
};

const getGuideProjects = async (guideId) => {
  const result = await pool.query(`
    SELECT p.project_id, p.title, p.abstract, p.status, p.created_at,
      ga.status AS assignment_status, ga.assigned_on,
      u.name AS created_by_name, t.team_name
    FROM guide_assignments ga
    JOIN teams t ON ga.team_id = t.team_id
    JOIN projects p ON t.project_id = p.project_id
    JOIN users u ON p.created_by = u.user_id
    WHERE ga.guide_id = $1
    ORDER BY ga.assigned_on DESC
  `, [guideId]);
  return result.rows;
};

module.exports = {
  getAvailableGuides,
  assignGuideToTeam,
  updateGuideAssignment,
  removeGuideAssignment,
  getGuideAssignments,
  getGuideProjects
};
