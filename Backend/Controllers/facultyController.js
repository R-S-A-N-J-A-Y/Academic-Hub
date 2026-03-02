const pool = require("../db/dbConfig");

const createFaculty = async (faculty) => {
  // `isguide` flag indicates whether the faculty member is available/assigned as a project guide.
  // default to false when not provided so existing behaviour stays the same.
  const { user_id, dept_id, designation, isguide = false } = faculty;

  const query = `
      INSERT INTO faculty (user_id, dept_id, designation, isguide)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

  const values = [user_id, dept_id, designation, isguide];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const fetchFaculties = async (deptId) => {
  // only return faculty members who are marked as guides
  const query = `
      SELECT 
        f.id,
        f.user_id,
        f.dept_id,
        f.designation,
        f.isguide,
        u.name,
        u.email
      FROM faculty f
      INNER JOIN users u ON f.user_id = u.user_id
      WHERE f.dept_id = $1
        AND COALESCE(f.isguide, false) = true
      ORDER BY u.name ASC;
    `;

  const result = await pool.query(query, [deptId]);
  return result.rows;
};

const fetchAllFaculties = async (deptId) => {
  // return all faculty members for a department (regardless of isguide)
  const query = `
      SELECT 
        f.id,
        f.user_id,
        f.dept_id,
        f.designation,
        f.isguide,
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

// returns count of guide-enabled faculty members for a department
const fetchGuideCount = async (deptId) => {
  const query = `
      SELECT COUNT(*) AS count
      FROM faculty
      WHERE dept_id = $1
        AND COALESCE(isguide, false) = true;
    `;
  const result = await pool.query(query, [deptId]);
  return Number(result.rows[0]?.count ?? 0);
};

const updateIsGuide = async (ids, isGuide) => {
  // ids should be array of faculty.id values
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const query = `
      UPDATE faculty
      SET isguide = $1
      WHERE id = ANY($2::int[])
      RETURNING id, user_id, dept_id, designation, isguide;
    `;

  const result = await pool.query(query, [isGuide, ids]);
  return result.rows;
};

const getFacultyDetails = async (userId) => {
  const res = await pool.query(
    "SELECT dept_id, designation FROM faculty WHERE user_id = $1",
    [userId],
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
  fetchAllFaculties,
  updateIsGuide,
  getFacultyDetails,
  getFacultyProfile,
  getMentorStats,
  fetchGuideCount
};
