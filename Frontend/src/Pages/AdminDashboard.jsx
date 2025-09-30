import React, { useEffect, useMemo, useState } from "react";
import Project from "../api/Project";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Components/Loader";
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
import { Lock } from "lucide-react";

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition transform hover:scale-105">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-3xl font-bold text-gray-900">{value}</span>
  </div>
);

const CustomBarTooltip = ({ active, payload, label, primaryColor }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border shadow-md rounded-lg" style={{ borderColor: primaryColor }}>
        <p className="text-sm font-semibold mb-1" style={{ color: primaryColor }}>{`Batch: ${label}`}</p>
        <p className="text-xs text-gray-700">{`Total Projects: `}
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
      <div className="bg-white p-3 border shadow-md rounded-lg" style={{ borderColor: data.color }}>
        <p className="text-sm font-semibold mb-1" style={{ color: data.color }}>{data.name}</p>
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
            <div className="bg-white p-3 border shadow-md rounded-lg" style={{ borderColor: primaryColor }}>
                <p className="text-sm font-semibold mb-1" style={{ color: primaryColor }}>{`Month: ${label}`}</p>
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
    return Array.from(map.entries()).map(([batch, count]) => ({ batch, count }));
  }, [projects]);

  const statusPieData = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => Boolean(p.ispublished) || Boolean(p.paper_link)).length;
    // console.log(published)
    // console.log(projects)
    const inProgress = projects.filter((p) => p.status === "in-progress").length;
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
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Projects per Batch</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perBatchData}>
              <XAxis dataKey="batch" />
              <YAxis allowDecimals={false} />
              {/* Updated Tooltip for Bar Chart */}
              <ReTooltip
                content={<CustomBarTooltip primaryColor={primaryColor} />}
                cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} // Light gray transparent cursor
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
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Project Status Distribution</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusPieData} dataKey="value" nameKey="name" outerRadius={80} label>
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
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="font-semibold text-gray-800 mb-3">New Projects Pending Guide Review Over Time</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={newOverTimeData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              {/* NEW: Custom Tooltip for Line Chart */}
              <ReTooltip content={<CustomLineTooltip primaryColor={primaryColor} />} />
              <Line type="monotone" dataKey="count" stroke={primaryColor} strokeWidth={2} dot={false} />
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
  
    useEffect(() => {
      const fetchAll = async () => {
        try {
          setLoading(true);
          const [projectsRes, deptsRes, batchesRes] = await Promise.all([
            auth?.role === "coordinator"
              ? Project.getAllProjectsByDepartment(auth.dept_id)
              : Project.getAllProjects(),
            axiosInstance.get("/departments"),
            axiosInstance.get("/batches"),
          ]);
  
          setProjects(projectsRes.data || projectsRes);
          setBatches(batchesRes.data || []);
          if (auth?.role === "coordinator") {
            const deptObj = (deptsRes.data || []).find(
              (d) => String(d.dept_id) === String(auth.dept_id)
            );
            if (deptObj?.dept_name) setCoordinatorDeptName(deptObj.dept_name);
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
          (p) => (p.department || p.dept_name) === coordinatorDeptName
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
        String(b.batch_name).includes(String(startYear))
      );
      return match?.batch_name || "";
    }, [batches]);
  
    const stats = useMemo(() => {
      const inCurrentBatch = filteredProjects.filter(
        (p) => p.batch_name === currentFinalYearBatchName
      );
      const total = inCurrentBatch.length;
      const published = inCurrentBatch.filter(
        (p) => Boolean(p.ispublished) || Boolean(p.paper_link)
      ).length;
      const inProgress = inCurrentBatch.filter((p) => p.status === "in-progress")
        .length;
      const newCount = inCurrentBatch.filter(
        (p) => (p.status || "new") === "new"
      ).length;
      return { total, newCount, inProgress, published };
    }, [filteredProjects, currentFinalYearBatchName]);
  
    const recentProjects = useMemo(() => {
      return [...filteredProjects]
        .sort(
          (a, b) =>
            new Date(b.created_at || b.updated_at) -
            new Date(a.created_at || a.updated_at)
        )
        .slice(0, 8);
    }, [filteredProjects]);
  
    const isCoordinator = auth?.role === "coordinator";
    const dashboardTitle = isCoordinator ? "Coordinator Dashboard" : "Admin Dashboard";

  
    // ✅ Do conditional render here instead
    if (loading) {
      return <Loader />;
    }

  return (
    <div className="p-6 space-y-12 bg-gray-50 min-h-screen">
      {/* Header with batch dropdown next to title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {dashboardTitle}
          {isCoordinator && coordinatorDeptName ? (
            <span className="ml-2 text-lg font-semibold text-gray-500">— {coordinatorDeptName}</span>
          ) : null}
        </h1>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.batch}
            onChange={(e) => setFilters({ batch: e.target.value })}
          >
            <option value="">All Batches</option>
            {batches.map((b) => (
              <option key={b.batch_id || b.batch_name} value={b.batch_name}>
                {b.batch_name}
              </option>
            ))}
          </select>
          <button
            className="px-5 py-2 bg-[#155dfc] text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => setFilters({ batch: "" })}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard label="Total Projects (Current Batch)" value={stats.total} />
        <StatCard label="New Projects" value={stats.newCount} />
        <StatCard label="In-progress Projects" value={stats.inProgress} />
        <StatCard label="Published Projects" value={stats.published} />
      </div>

      {/* Charts */}
      <ChartsSection projects={filteredProjects} primaryColor="#155dfc" />

      {/* Recent Projects Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 flex items-center justify-between bg-[#155dfc]/10">
          <h2 className="font-semibold text-gray-800 text-lg">
            {`Recent Projects${coordinatorDeptName ? ` (${coordinatorDeptName})` : ""}`}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
  <thead className="bg-[#155dfc]/10 text-gray-700">
    <tr>
      <th className="px-3 py-2 text-left font-medium">Title</th>
      <th className="px-3 py-2 text-left font-medium">Batch</th>
      <th className="px-3 py-2 text-left font-medium">Status</th>
      <th className="px-3 py-2 text-left font-medium">Guide</th>
      <th className="px-3 py-2 text-right font-medium">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {loading ? (
      <tr>
        <td className="px-3 py-4 text-center" colSpan={5}>Loading...</td>
      </tr>
    ) : recentProjects.length === 0 ? (
      <tr>
        <td className="px-3 py-4 text-center" colSpan={5}>No projects found</td>
      </tr>
    ) : (
      recentProjects.map((p) => (
         <tr key={p.project_id} className="hover:bg-gray-50">
           <td className="px-3 py-2 font-medium text-gray-900 flex items-center gap-2">
             {p.visibility && p.visibility !== "public" ? (
               <Lock size={16} className="text-gray-500" />
             ) : null}
             <span>{p.title}</span>
           </td>
          <td className="px-3 py-2">{p.batch_name}</td>
          <td className="px-3 py-2 capitalize">{p.status || "new"}</td>
          <td className="px-3 py-2">{p.guide_name || "—"}</td>
          <td className="px-3 py-2 text-right">
            <button
              className="px-2 py-1 text-[#155dfc] font-medium hover:underline"
              onClick={() => navigate(`/projects/${p.project_id}`)}
            >
              View
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
