const pool = require("../db/dbConfig");

// Create a team
const createTeam = async (projectId, teamName, leaderId, guideId = null) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const teamQuery = `
      INSERT INTO teams (project_id, team_name, guide_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const teamResult = await client.query(teamQuery, [projectId, teamName, guideId]);
    const team = teamResult.rows[0];

    await client.query(`
      INSERT INTO team_members (team_id, user_id, role_in_team)
      VALUES ($1, $2, 'leader');
    `, [team.team_id, leaderId]);

    await client.query('COMMIT');
    return team;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Add member
const addTeamMember = async (teamId, userId, role = 'member') => {
  const result = await pool.query(`
    INSERT INTO team_members (team_id, user_id, role_in_team)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [teamId, userId, role]);
  return result.rows[0];
};

// Validate members
const validateTeamMembers = async (emails, creatorUserId) => {
  // Get creator batch & dept
  const creator = await pool.query(`
    SELECT s.batch_id, s.dept_id
    FROM students s
    WHERE s.user_id = $1
  `, [creatorUserId]);
  if (!creator.rows.length) throw new Error("Creator must be a student");

  const validation = await pool.query(`
    SELECT u.user_id, u.name, u.email, s.batch_id, s.dept_id
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    WHERE u.email = ANY($1) AND u.role = 'student'
  `, [emails]);

  if (validation.rows.length !== emails.length) {
    const foundEmails = validation.rows.map(r => r.email);
    const missing = emails.filter(e => !foundEmails.includes(e));
    throw new Error(`Invalid emails: ${missing.join(', ')}`);
  }

  const invalidMembers = validation.rows.filter(m => 
    m.batch_id !== creator.rows[0].batch_id || m.dept_id !== creator.rows[0].dept_id
  );
  if (invalidMembers.length) throw new Error(`Members must be from same batch/department`);

  const creatorInList = validation.rows.find(m => m.user_id === creatorUserId);
  if (creatorInList) throw new Error("Creator cannot be added as member");

  return validation.rows;
};

// Other helpers
const getTeamByProject = async (projectId) => {
  const result = await pool.query(`
    SELECT t.team_id, t.team_name, t.created_at
    FROM teams t
    WHERE t.project_id = $1
  `, [projectId]);
  return result.rows[0];
};

const removeTeamMember = async (teamId, userId) => {
  const result = await pool.query(`
    DELETE FROM team_members
    WHERE team_id = $1 AND user_id = $2
    RETURNING *;
  `, [teamId, userId]);
  return result.rows[0];
};

const isTeamMember = async (projectId, userId) => {
  const result = await pool.query(`
    SELECT tm.role_in_team
    FROM teams t
    JOIN team_members tm ON t.team_id = tm.team_id
    WHERE t.project_id = $1 AND tm.user_id = $2
  `, [projectId, userId]);
  return result.rows[0];
};

module.exports = {
  createTeam,
  addTeamMember,
  validateTeamMembers,
  getTeamByProject,
  removeTeamMember,
  isTeamMember
};
