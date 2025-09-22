const pool = require("../db/dbConfig");

const createFaculty = async (faculty) => {
  const { user_id, dept_id, designation } = faculty;

  const query = `
    INSERT INTO faculty (user_id, dept_id, designation)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [user_id, dept_id, designation];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const fetchFaculties = async (deptId) => {
  const query = `
    SELECT 
      f.id,
      f.user_id,
      f.dept_id,
      f.designation,
      u.name,
      u.email
    FROM faculty f
    INNER JOIN users u ON f.user_id = u.user_id
    WHERE f.dept_id = $1
    ORDER BY u.name ASC;
  `;

  const result = await pool.query(query, [deptId]);
  return result.rows;
};

const getFacultyDetails = async (userId) => {
  const res = await pool.query(
    "SELECT dept_id, designation FROM faculty WHERE user_id = $1",
    [userId]
  );
  return res.rows.length > 0 ? res.rows[0] : {};
};

const getFacultyProfile = async (userId) => {
  const query = `
    SELECT 
      u.user_id,
      u.name,
      u.email,
      u.role,
      f.designation,
      d.dept_name as department
    FROM users u
    INNER JOIN faculty f ON u.user_id = f.user_id
    LEFT JOIN department d ON f.dept_id = d.dept_id
    WHERE u.user_id = $1;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getMentorStats = async (id) => {
  // 🔹 Fetch mentor details with join
  const facultyQuery = `
    SELECT 
      u.name, 
      u.email, 
      f.dept_id, 
      f.designation
    FROM faculty f
    JOIN users u ON u.user_id = f.user_id
    WHERE f.user_id = $1
    LIMIT 1;
  `;

  const personalQuery = `
    SELECT 
      p.project_id,
      p.title,
      p.status,
      p.category AS project_type,
      COALESCE(p.ispublished, false) AS ispublished,
      p.paper_link,
      p.conference_name,
      p.conference_year,
      p.conference_status
    FROM projects p
    WHERE p.created_by = $1
    ORDER BY p.created_at DESC;
  `;

  const guidedQuery = `
    SELECT 
      p.project_id,
      p.title,
      p.status,
      p.category AS project_type,
      COALESCE(p.ispublished, false) AS ispublished,
      p.paper_link,
      p.conference_name,
      p.conference_year,
      p.conference_status
    FROM projects p
    WHERE p.guide_id = $1
    ORDER BY p.created_at DESC;
  `;

  const statsQuery = `
    SELECT 
      SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN p.status IN ('in-progress','approved','pending','new') THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN p.status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
      SUM(CASE WHEN COALESCE(p.ispublished, false) = true THEN 1 ELSE 0 END) AS published
    FROM projects p
    WHERE p.created_by = $1 OR p.guide_id = $1;
  `;

  const [facultyRes, personalRes, guidedRes, statsRes] = await Promise.all([
    pool.query(facultyQuery, [id]),
    pool.query(personalQuery, [id]),
    pool.query(guidedQuery, [id]),
    pool.query(statsQuery, [id]),
  ]);

  const faculty = facultyRes.rows[0] || {};

  return {
    mentor: {
      name: faculty.name || "N/A",
      email: faculty.email || "N/A",
      dept_id: faculty.dept_id || "N/A",
      designation: faculty.designation || "N/A",
    },
    personal_projects: personalRes.rows,
    guided_projects: guidedRes.rows,
    stats: {
      completed: Number(statsRes.rows[0]?.completed ?? 0),
      in_progress: Number(statsRes.rows[0]?.in_progress ?? 0),
      rejected: Number(statsRes.rows[0]?.rejected ?? 0),
      published: Number(statsRes.rows[0]?.published ?? 0),
    },
  };
};

module.exports = {
  createFaculty,
  fetchFaculties,
  getFacultyDetails,
  getFacultyProfile,
  getMentorStats,
};
