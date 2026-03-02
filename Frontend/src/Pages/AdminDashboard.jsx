import React, { useEffect, useMemo, useState } from "react";
import Project from "../api/Project";
import Faculty from "../api/Faculty";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Components/Loader";
import DropDown from "../Components/DropDown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Lock,
  ClipboardList,
  PlusCircle,
  RefreshCw,
  CheckCircle,
  Building,
  UserCheck,
  Tag,
} from "lucide-react";

const StatCard = ({ label, value, Icon }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-start transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    {Icon && <Icon className="h-6 w-6 text-blue-500 mb-2" />}
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-3xl font-bold text-gray-900">{value}</span>
  </div>
);

// helper for recent-project status badges
const getStatusBadge = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    new: "bg-blue-100 text-blue-800",
    "in-progress": "bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800",
    published: "bg-green-100 text-green-800",
  };
  const label = String(status || "")
    .replace(/[-\s]+/g, " ")
    .toUpperCase();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}
    >
      {label}
    </span>
  );
};

const CustomBarTooltip = ({ active, payload, label, primaryColor }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-white p-3 border shadow-md rounded-lg"
        style={{ borderColor: primaryColor }}
      >
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: primaryColor }}
        >{`Batch: ${label}`}</p>
        <p className="text-xs text-gray-700">
          {`Total Projects: `}
          <span className="font-bold">{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

// 2. Custom Tooltip for Pie Chart (Project Status Distribution)
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-white p-3 border shadow-md rounded-lg"
        style={{ borderColor: data.color }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-xs text-gray-700">
          {`Projects: `}
          <span className="font-bold">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// 3. Custom Tooltip for Line Chart (New Projects Over Time)
const CustomLineTooltip = ({ active, payload, label, primaryColor }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-white p-3 border shadow-md rounded-lg"
        style={{ borderColor: primaryColor }}
      >
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: primaryColor }}
        >{`Month: ${label}`}</p>
        <p className="text-xs text-gray-700">
          {`New Projects: `}
          <span className="font-bold">{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ChartsSection = ({ projects, primaryColor }) => {
  // Data calculations remain the same
  const perBatchData = useMemo(() => {
    const map = new Map();
    for (const p of projects) {
      const key = p.batch_name || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([batch, count]) => ({
      batch,
      count,
    }));
  }, [projects]);

  const statusPieData = useMemo(() => {
    const total = projects.length;
    const published = projects.filter(
      (p) => Boolean(p.ispublished) || Boolean(p.paper_link),
    ).length;
    const inProgress = projects.filter(
      (p) => p.status === "in-progress",
    ).length;
    const pending = Math.max(total - published - inProgress, 0);
    return [
      { name: "Published", value: published, color: primaryColor },
      { name: "In-progress", value: inProgress, color: "#22c55e" },
      { name: "Pending", value: pending, color: "#f59e0b" },
    ];
  }, [projects, primaryColor]);

  const newOverTimeData = useMemo(() => {
    const map = new Map();
    for (const p of projects) {
      if ((p.status || "new") !== "new") continue;
      const date = new Date(p.created_at || p.updated_at || Date.now());
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([month, count]) => ({ month, count }))
      .slice(-12);
  }, [projects]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Projects per Batch - Bar Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="font-semibold text-gray-800 mb-3">Projects per Batch</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perBatchData}>
              <XAxis dataKey="batch" />
              <YAxis allowDecimals={false} />
              {/* Updated Tooltip for Bar Chart */}
              <ReTooltip
                content={<CustomBarTooltip primaryColor={primaryColor} />}
                cursor={{ fill: "rgba(230, 230, 230, 0.5)" }} // Light gray transparent cursor
              />
              <Bar
                dataKey="count"
                fill={primaryColor}
                radius={[6, 6, 0, 0]}
                activeBar={{ fill: primaryColor, opacity: 0.8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Status Distribution - Pie Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="font-semibold text-gray-800 mb-3">
          Project Status Distribution
        </h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* NEW: Custom Tooltip for Pie Chart */}
              <ReTooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Projects Pending Guide Review Over Time - Line Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="font-semibold text-gray-800 mb-3">
          New Projects Pending Guide Review Over Time
        </h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={newOverTimeData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              {/* NEW: Custom Tooltip for Line Chart */}
              <ReTooltip
                content={<CustomLineTooltip primaryColor={primaryColor} />}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={primaryColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filters, setFilters] = useState({ batch: "" });
  const [coordinatorDeptName, setCoordinatorDeptName] = useState("");
  const [mentorsCount, setMentorsCount] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // base requests
        const requests = [
          auth?.role === "coordinator"
            ? Project.getAllProjectsByDepartment(auth.dept_id)
            : Project.getAllProjects(),
          axiosInstance.get("/departments"),
          axiosInstance.get("/batches"),
        ];
        // if coordinator, also fetch mentor count
        if (auth?.role === "coordinator") {
          requests.push(Faculty.getGuideCount(auth.dept_id));
        }

        const [projectsRes, deptsRes, batchesRes, mentorsRes] =
          await Promise.all(requests);

        setProjects(projectsRes.data || projectsRes);
        setBatches(batchesRes.data || []);
        if (auth?.role === "coordinator") {
          const deptObj = (deptsRes.data || []).find(
            (d) => String(d.dept_id) === String(auth.dept_id),
          );
          if (deptObj?.dept_name) setCoordinatorDeptName(deptObj.dept_name);
          // mentorsRes at index 3 may already be data object if using API helper
          if (mentorsRes) {
            setMentorsCount(
              mentorsRes.count ||
                mentorsRes.data?.count ||
                mentorsRes.data?.data?.count ||
                0,
            );
          }
        }
      } catch (err) {
        console.error("Failed fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [auth?.role, auth?.dept_id]);

  // ✅ All hooks stay here — nothing conditional before them
  const filteredProjects = useMemo(() => {
    let list = Array.isArray(projects) ? projects : [];
    if (auth?.role === "coordinator" && coordinatorDeptName) {
      list = list.filter(
        (p) => (p.department || p.dept_name) === coordinatorDeptName,
      );
    }
    if (filters.batch) {
      list = list.filter((p) => (p.batch_name || p.batch) === filters.batch);
    }
    return list;
  }, [projects, filters, auth?.role, coordinatorDeptName]);

  const currentFinalYearBatchName = useMemo(() => {
    const now = new Date();
    const startYear = now.getFullYear() - 3;
    const match = (batches || []).find((b) =>
      String(b.batch_name).includes(String(startYear)),
    );
    return match?.batch_name || "";
  }, [batches]);

  const stats = useMemo(() => {
    const list =
      currentFinalYearBatchName && currentFinalYearBatchName !== ""
        ? filteredProjects.filter(
            (p) => p.batch_name === currentFinalYearBatchName,
          )
        : filteredProjects;

    const total = list.length;
    const published = list.filter(
      (p) => Boolean(p.ispublished) || Boolean(p.paper_link),
    ).length;
    const inProgress = list.filter((p) => p.status === "in-progress").length;
    const newCount = list.filter((p) => (p.status || "new") === "new").length;
    return { total, newCount, inProgress, published };
  }, [filteredProjects, currentFinalYearBatchName]);

  const recentProjects = useMemo(() => {
    return [...filteredProjects]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.updated_at) -
          new Date(a.created_at || a.updated_at),
      )
      .slice(0, 8);
  }, [filteredProjects]);

  const isCoordinator = auth?.role === "coordinator";
  const dashboardTitle = isCoordinator
    ? "Coordinator Dashboard"
    : "Admin Dashboard";

  // ✅ Do conditional render here instead
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 space-y-12 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Header with batch dropdown next to title */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">
          {dashboardTitle}
          {isCoordinator && coordinatorDeptName ? (
            <span className="ml-2 text-lg font-semibold text-gray-500">
              — {coordinatorDeptName}
            </span>
          ) : null}
        </h1>
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-inner">
          <DropDown
            data={["All Batches", ...batches.map((b) => b.batch_name)]}
            name={filters.batch || "All Batches"}
            setter={(val) => {
              setFilters({ batch: val === "All Batches" ? "" : val });
            }}
          />
          <button
            className="px-5 py-2 bg-white/50 text-blue-600 border border-blue-300 rounded-full hover:bg-white/70 transition-all duration-200"
            onClick={() => setFilters({ batch: "" })}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-5 gap-6">
        <StatCard
          Icon={ClipboardList}
          label="Total Projects (Current Batch)"
          value={stats.total}
        />
        <StatCard
          Icon={PlusCircle}
          label="New Projects"
          value={stats.newCount}
        />
        <StatCard
          Icon={RefreshCw}
          label="In-progress Projects"
          value={stats.inProgress}
        />
        <StatCard
          Icon={CheckCircle}
          label="Published Projects"
          value={stats.published}
        />
        {isCoordinator && (
          <StatCard Icon={UserCheck} label="Mentors" value={mentorsCount} />
        )}
      </div>

      {/* Charts */}
      <ChartsSection projects={filteredProjects} primaryColor="#155dfc" />

      {/* Recent Projects Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-lg">
            {`Recent Projects${coordinatorDeptName ? ` (${coordinatorDeptName})` : ""}`}
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center text-gray-500">No projects found</div>
          ) : (
            recentProjects.map((p) => (
              <div
                key={p.project_id}
                className="bg-white rounded-2xl shadow-sm p-4 transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {p.visibility && p.visibility !== "public" && (
                      <Lock size={16} className="text-gray-500" />
                    )}
                    <span className="font-bold text-gray-900">{p.title}</span>
                    {p.category && <Tag size={16} className="text-gray-400" />}
                  </div>
                  <div>{getStatusBadge((p.status || "new").toLowerCase())}</div>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <ClipboardList size={14} className="text-gray-500" />
                    {p.batch_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck size={14} className="text-gray-500" />
                    {p.guide_name || "—"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Building size={14} className="text-gray-500" />
                    {p.department || p.dept_name || "—"}
                  </div>
                </div>
                <div className="mt-3 border-t border-gray-200 pt-2 text-right">
                  <button
                    className="text-blue-600 font-medium hover:underline"
                    onClick={() => navigate(`/projects/${p.project_id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
