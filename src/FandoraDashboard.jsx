import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#c084fc", "#e879f9",
  "#f472b6", "#fb7185", "#f87171", "#fb923c", "#fbbf24", "#34d399"
];

const DEPT_COLORS = {
  "企劃部": "#6366f1",
  "後勤部": "#8b5cf6",
  "商品開發部": "#e879f9",
  "銷售部": "#fb923c",
  "商品商發部": "#34d399",
  "管理部": "#fbbf24"
};

// ── Embedded Data ──
const DATA = {
  summary: { totalHours: 7800.3, totalEntries: 5228, totalEmployees: 11, totalMonths: 5, avgMonthlyHours: 1560.1 },
  monthlyHours: [
    { month: "2025-09", hours: 1545.0 },
    { month: "2025-10", hours: 1491.2 },
    { month: "2025-11", hours: 1491.2 },
    { month: "2025-12", hours: 1491.2 },
    { month: "2026-01", hours: 1781.6 }
  ],
  employeeMonthly: [
    { month: "2025-09", "余凱紓": 134.5, "侯渝琪": 149.0, "劉蕙慈": 152.0, "吳佳香": 166.8, "李宜臻": 178.5, "林宜萱": 138.2, "潘美怡": 159.0, "許茹津": 157.5, "陳姿羽": 159.0, "陳敏佳": 150.5, "陳敬文": 0 },
    { month: "2025-10", "余凱紓": 144.3, "侯渝琪": 148.0, "劉蕙慈": 148.0, "吳佳香": 149.0, "李宜臻": 180.0, "林宜萱": 144.4, "潘美怡": 159.0, "許茹津": 156.0, "陳姿羽": 108.0, "陳敏佳": 154.5, "陳敬文": 0 },
    { month: "2025-11", "余凱紓": 144.3, "侯渝琪": 148.0, "劉蕙慈": 148.0, "吳佳香": 149.0, "李宜臻": 180.0, "林宜萱": 144.4, "潘美怡": 159.0, "許茹津": 156.0, "陳姿羽": 108.0, "陳敏佳": 154.5, "陳敬文": 0 },
    { month: "2025-12", "余凱紓": 144.3, "侯渝琪": 148.0, "劉蕙慈": 148.0, "吳佳香": 149.0, "李宜臻": 180.0, "林宜萱": 144.4, "潘美怡": 159.0, "許茹津": 156.0, "陳姿羽": 108.0, "陳敏佳": 154.5, "陳敬文": 0 },
    { month: "2026-01", "余凱紓": 164.1, "侯渝琪": 129.0, "劉蕙慈": 156.0, "吳佳香": 168.0, "李宜臻": 196.0, "林宜萱": 169.3, "潘美怡": 148.7, "許茹津": 168.0, "陳姿羽": 164.5, "陳敏佳": 169.0, "陳敬文": 149.0 }
  ],
  employees: ["余凱紓", "侯渝琪", "劉蕙慈", "吳佳香", "李宜臻", "林宜萱", "潘美怡", "許茹津", "陳姿羽", "陳敏佳", "陳敬文"],
  topTasks: [
    { task: "魔物獵人", hours: 791.1 }, { task: "客服", hours: 420.9 }, { task: "WirForce", hours: 392.2 },
    { task: "行政", hours: 385.8 }, { task: "倉庫", hours: 382.4 }, { task: "全體例會", hours: 359.1 },
    { task: "小學課本台灣主題", hours: 319.0 }, { task: "POD商品", hours: 253.3 }, { task: "老高", hours: 236.9 },
    { task: "ㄇㄚˊ幾", hours: 227.8 }, { task: "專案與年度計畫", hours: 222.4 }, { task: "其他會議", hours: 220.4 },
    { task: "新品sourcing", hours: 218.8 }, { task: "後勤例行", hours: 208.9 }, { task: "自營快閃", hours: 205.8 },
    { task: "採購", hours: 182.1 }, { task: "研習", hours: 180.0 }, { task: "業務開發", hours: 174.5 },
    { task: "MK", hours: 171.3 }, { task: "行銷報表", hours: 166.5 }
  ],
  departments: [
    { department: "企劃部", hours: 2449.5 }, { department: "後勤部", hours: 2257.0 },
    { department: "商品開發部", hours: 793.5 }, { department: "銷售部", hours: 781.8 },
    { department: "商品商發部", hours: 722.0 }, { department: "管理部", hours: 647.5 }
  ],
  employeeTotal: [
    { employee: "李宜臻", hours: 914.5 }, { employee: "許茹津", hours: 793.5 }, { employee: "潘美怡", hours: 784.7 },
    { employee: "陳敏佳", hours: 783.0 }, { employee: "吳佳香", hours: 781.8 }, { employee: "劉蕙慈", hours: 752.0 },
    { employee: "林宜萱", hours: 740.8 }, { employee: "余凱紓", hours: 731.6 }, { employee: "侯渝琪", hours: 722.0 },
    { employee: "陳姿羽", hours: 647.5 }, { employee: "陳敬文", hours: 149.0 }
  ],
  taskMonthly: [
    { month: "2025-09", "魔物獵人": 121.7, "客服": 64.8, "WirForce": 99.3, "行政": 110.6, "倉庫": 65.9, "全體例會": 68.3, "小學課本台灣主題": 30.5, "POD商品": 42.1, "老高": 118.4, "ㄇㄚˊ幾": 26.5 },
    { month: "2025-10", "魔物獵人": 131.8, "客服": 105.3, "WirForce": 97.6, "行政": 67.9, "倉庫": 87.9, "全體例會": 73.4, "小學課本台灣主題": 59.5, "POD商品": 51.2, "老高": 38.8, "ㄇㄚˊ幾": 43.0 },
    { month: "2025-11", "魔物獵人": 131.8, "客服": 105.3, "WirForce": 97.6, "行政": 67.9, "倉庫": 87.9, "全體例會": 73.4, "小學課本台灣主題": 59.5, "POD商品": 51.2, "老高": 38.8, "ㄇㄚˊ幾": 43.0 },
    { month: "2025-12", "魔物獵人": 131.8, "客服": 105.3, "WirForce": 97.6, "行政": 67.9, "倉庫": 87.9, "全體例會": 73.4, "小學課本台灣主題": 59.5, "POD商品": 51.2, "老高": 38.8, "ㄇㄚˊ幾": 43.0 },
    { month: "2026-01", "魔物獵人": 274.0, "客服": 40.2, "WirForce": 0, "行政": 71.5, "倉庫": 52.8, "全體例會": 70.6, "小學課本台灣主題": 110.0, "POD商品": 57.6, "老高": 2.3, "ㄇㄚˊ幾": 72.3 }
  ],
  topTaskNames: ["魔物獵人", "客服", "WirForce", "行政", "倉庫", "全體例會", "小學課本台灣主題", "POD商品", "老高", "ㄇㄚˊ幾"],
  employeeDept: {
    "余凱紓": "後勤部", "侯渝琪": "商品商發部", "劉蕙慈": "企劃部", "吳佳香": "銷售部",
    "李宜臻": "企劃部", "林宜萱": "後勤部", "潘美怡": "後勤部", "許茹津": "商品開發部",
    "陳姿羽": "管理部", "陳敏佳": "企劃部", "陳敬文": null
  }
};

const MONTH_LABELS = { "2025-09": "9月", "2025-10": "10月", "2025-11": "11月", "2025-12": "12月", "2026-01": "1月" };

// ── Components ──

function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      borderRadius: 16, padding: "24px 28px",
      border: "1px solid rgba(99,102,241,0.25)",
      flex: "1 1 200px", minWidth: 180
    }}>
      <div style={{ fontSize: 13, color: "#a5b4fc", fontWeight: 500, marginBottom: 4, letterSpacing: 0.5 }}>{icon} {label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: "#e0e7ff", lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#818cf8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 18, fontWeight: 700, color: "#c7d2fe",
      margin: "32px 0 16px", paddingBottom: 8,
      borderBottom: "2px solid rgba(99,102,241,0.3)"
    }}>{children}</h2>
  );
}

function CustomTooltip({ active, payload, label, suffix = "h" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e1b4b", border: "1px solid #4338ca", borderRadius: 10,
      padding: "10px 14px", fontSize: 12, color: "#e0e7ff"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#a5b4fc" }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ──
export default function FandoraDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const tabs = [
    { id: "overview", label: "總覽" },
    { id: "employees", label: "員工分析" },
    { id: "tasks", label: "任務分析" },
    { id: "departments", label: "部門分析" }
  ];

  const filteredEmpMonthly = useMemo(() => {
    if (!selectedEmployee) return DATA.employeeMonthly;
    return DATA.employeeMonthly.map(row => ({
      month: row.month,
      [selectedEmployee]: row[selectedEmployee]
    }));
  }, [selectedEmployee]);

  const deptEmployees = useMemo(() => {
    if (!selectedDept) return DATA.employeeTotal;
    return DATA.employeeTotal.filter(e => DATA.employeeDept[e.employee] === selectedDept);
  }, [selectedDept]);

  // Radar data for selected employee
  const radarData = useMemo(() => {
    if (!selectedEmployee) return [];
    // We'll compute from taskMonthly what fraction of top tasks this employee worked on
    // For simplicity, show their monthly hours as radar
    return DATA.employeeMonthly.map(row => ({
      month: MONTH_LABELS[row.month] || row.month,
      hours: row[selectedEmployee] || 0
    }));
  }, [selectedEmployee]);

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(180deg, #0f0a1e 0%, #1a1145 50%, #0f0a1e 100%)",
      color: "#e0e7ff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "24px 32px"
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Fandora 工作日誌 Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "#7c7cb0", margin: "4px 0 0" }}>2025年9月 – 2026年1月 | 工時總覽與分析</p>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#1e1b4b", borderRadius: 10, padding: 4, border: "1px solid rgba(99,102,241,0.2)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSelectedEmployee(null); setSelectedDept(null); }}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                background: activeTab === t.id ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "transparent",
                color: activeTab === t.id ? "#fff" : "#818cf8"
              }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
        <StatCard icon="⏱" label="總工時" value={DATA.summary.totalHours.toLocaleString() + "h"} sub="5 個月累計" />
        <StatCard icon="📋" label="工作紀錄" value={DATA.summary.totalEntries.toLocaleString()} sub="筆" />
        <StatCard icon="👥" label="員工人數" value={DATA.summary.totalEmployees} sub="位" />
        <StatCard icon="📊" label="月均工時" value={DATA.summary.avgMonthlyHours.toLocaleString() + "h"} sub="每月平均" />
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === "overview" && (
        <div>
          <SectionTitle>每月總工時趨勢</SectionTitle>
          <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={DATA.monthlyHours}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                <XAxis dataKey="month" tick={{ fill: "#818cf8", fontSize: 12 }} tickFormatter={v => MONTH_LABELS[v] || v} />
                <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fill="url(#hoursGrad)" name="總工時" dot={{ fill: "#818cf8", r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 8 }}>
            <div>
              <SectionTitle>Top 10 任務 (工時)</SectionTitle>
              <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={DATA.topTasks.slice(0, 10)} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                    <XAxis type="number" tick={{ fill: "#818cf8", fontSize: 11 }} />
                    <YAxis type="category" dataKey="task" tick={{ fill: "#c7d2fe", fontSize: 12 }} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="hours" name="工時" radius={[0, 6, 6, 0]}>
                      {DATA.topTasks.slice(0, 10).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <SectionTitle>部門工時分布</SectionTitle>
              <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
                <ResponsiveContainer width="100%" height={360}>
                  <PieChart>
                    <Pie data={DATA.departments} dataKey="hours" nameKey="department" cx="50%" cy="50%"
                      outerRadius={120} innerRadius={60} strokeWidth={2} stroke="#0f0a1e"
                      label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: "#818cf8" }}>
                      {DATA.departments.map((d, i) => (
                        <Cell key={i} fill={DEPT_COLORS[d.department] || COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}h`} contentStyle={{ background: "#1e1b4b", border: "1px solid #4338ca", borderRadius: 8, color: "#e0e7ff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EMPLOYEES TAB ═══ */}
      {activeTab === "employees" && (
        <div>
          <SectionTitle>員工總工時排名</SectionTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => setSelectedEmployee(null)}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid #4338ca", cursor: "pointer",
                background: !selectedEmployee ? "#4f46e5" : "transparent", color: !selectedEmployee ? "#fff" : "#818cf8",
                fontSize: 12, fontWeight: 600
              }}>全部</button>
            {DATA.employees.map(emp => (
              <button key={emp} onClick={() => setSelectedEmployee(emp)}
                style={{
                  padding: "6px 14px", borderRadius: 20, border: "1px solid #4338ca", cursor: "pointer",
                  background: selectedEmployee === emp ? "#4f46e5" : "transparent",
                  color: selectedEmployee === emp ? "#fff" : "#818cf8",
                  fontSize: 12, fontWeight: 600
                }}>{emp}</button>
            ))}
          </div>

          {!selectedEmployee && (
            <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={DATA.employeeTotal} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                  <XAxis dataKey="employee" tick={{ fill: "#c7d2fe", fontSize: 12, angle: -30 }} interval={0} height={60} textAnchor="end" />
                  <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="hours" name="總工時" radius={[8, 8, 0, 0]}>
                    {DATA.employeeTotal.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedEmployee && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "24px", border: "1px solid rgba(99,102,241,0.15)", marginBottom: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#c7d2fe" }}>{selectedEmployee}</div>
                  <div style={{ fontSize: 13, color: "#818cf8", marginTop: 4 }}>
                    {DATA.employeeDept[selectedEmployee] || "未分配"} | 總工時: {DATA.employeeTotal.find(e => e.employee === selectedEmployee)?.hours || 0}h
                  </div>
                </div>
                <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>每月工時</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={filteredEmpMonthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                      <XAxis dataKey="month" tick={{ fill: "#818cf8", fontSize: 12 }} tickFormatter={v => MONTH_LABELS[v] || v} />
                      <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey={selectedEmployee} name={selectedEmployee} fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>月度工時雷達圖</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(99,102,241,0.2)" />
                      <PolarAngleAxis dataKey="month" tick={{ fill: "#c7d2fe", fontSize: 12 }} />
                      <PolarRadiusAxis tick={{ fill: "#818cf8", fontSize: 10 }} />
                      <Radar name={selectedEmployee} dataKey="hours" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                      <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid #4338ca", borderRadius: 8, color: "#e0e7ff" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <SectionTitle>員工月度工時堆疊圖</SectionTitle>
          <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={DATA.employeeMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                <XAxis dataKey="month" tick={{ fill: "#818cf8", fontSize: 12 }} tickFormatter={v => MONTH_LABELS[v] || v} />
                <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#c7d2fe" }} />
                {DATA.employees.map((emp, i) => (
                  <Area key={emp} type="monotone" dataKey={emp} stackId="1" stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.6} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ═══ TASKS TAB ═══ */}
      {activeTab === "tasks" && (
        <div>
          <SectionTitle>Top 20 任務工時</SectionTitle>
          <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={DATA.topTasks} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                <XAxis type="number" tick={{ fill: "#818cf8", fontSize: 11 }} />
                <YAxis type="category" dataKey="task" tick={{ fill: "#c7d2fe", fontSize: 12 }} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="工時" radius={[0, 6, 6, 0]}>
                  {DATA.topTasks.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <SectionTitle>Top 10 任務月度趨勢</SectionTitle>
          <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={DATA.taskMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                <XAxis dataKey="month" tick={{ fill: "#818cf8", fontSize: 12 }} tickFormatter={v => MONTH_LABELS[v] || v} />
                <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {DATA.topTaskNames.map((task, i) => (
                  <Line key={task} type="monotone" dataKey={task} stroke={COLORS[i]} strokeWidth={2}
                    dot={{ r: 4, fill: COLORS[i] }} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ═══ DEPARTMENTS TAB ═══ */}
      {activeTab === "departments" && (
        <div>
          <SectionTitle>部門工時總覽</SectionTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => setSelectedDept(null)}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid #4338ca", cursor: "pointer",
                background: !selectedDept ? "#4f46e5" : "transparent", color: !selectedDept ? "#fff" : "#818cf8",
                fontSize: 12, fontWeight: 600
              }}>全部</button>
            {DATA.departments.map(d => (
              <button key={d.department} onClick={() => setSelectedDept(d.department)}
                style={{
                  padding: "6px 14px", borderRadius: 20, border: "1px solid #4338ca", cursor: "pointer",
                  background: selectedDept === d.department ? "#4f46e5" : "transparent",
                  color: selectedDept === d.department ? "#fff" : "#818cf8",
                  fontSize: 12, fontWeight: 600
                }}>{d.department}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={selectedDept ? DATA.departments.filter(d => d.department === selectedDept) : DATA.departments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                  <XAxis dataKey="department" tick={{ fill: "#c7d2fe", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="hours" name="部門工時" radius={[8, 8, 0, 0]}>
                    {(selectedDept ? DATA.departments.filter(d => d.department === selectedDept) : DATA.departments).map((d, i) => (
                      <Cell key={i} fill={DEPT_COLORS[d.department] || COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 16px", border: "1px solid rgba(99,102,241,0.15)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
                {selectedDept ? `${selectedDept} 員工` : "各部門員工工時"}
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={deptEmployees} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
                  <XAxis dataKey="employee" tick={{ fill: "#c7d2fe", fontSize: 12, angle: -30 }} interval={0} height={60} textAnchor="end" />
                  <YAxis tick={{ fill: "#818cf8", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="hours" name="員工工時" radius={[8, 8, 0, 0]}>
                    {deptEmployees.map((e, i) => (
                      <Cell key={i} fill={DEPT_COLORS[DATA.employeeDept[e.employee]] || COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department headcount table */}
          <SectionTitle>部門人員配置</SectionTitle>
          <div style={{ background: "rgba(30,27,75,0.6)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(99,102,241,0.15)" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
              <thead>
                <tr style={{ fontSize: 13, color: "#818cf8", fontWeight: 600 }}>
                  <td style={{ padding: "8px 12px" }}>部門</td>
                  <td style={{ padding: "8px 12px" }}>總工時</td>
                  <td style={{ padding: "8px 12px" }}>人數</td>
                  <td style={{ padding: "8px 12px" }}>人均工時</td>
                  <td style={{ padding: "8px 12px" }}>佔比</td>
                  <td style={{ padding: "8px 12px", width: "40%" }}>工時佔比</td>
                </tr>
              </thead>
              <tbody>
                {DATA.departments.map((d, i) => {
                  const headcount = Object.values(DATA.employeeDept).filter(v => v === d.department).length;
                  const pct = ((d.hours / DATA.summary.totalHours) * 100).toFixed(1);
                  return (
                    <tr key={i} style={{
                      background: selectedDept === d.department ? "rgba(79,70,229,0.2)" : "rgba(99,102,241,0.05)",
                      borderRadius: 8, cursor: "pointer"
                    }} onClick={() => setSelectedDept(selectedDept === d.department ? null : d.department)}>
                      <td style={{ padding: "10px 12px", borderRadius: "8px 0 0 8px", fontWeight: 600, color: "#e0e7ff" }}>
                        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: DEPT_COLORS[d.department], marginRight: 8 }} />
                        {d.department}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#c7d2fe" }}>{d.hours}h</td>
                      <td style={{ padding: "10px 12px", color: "#c7d2fe" }}>{headcount}</td>
                      <td style={{ padding: "10px 12px", color: "#c7d2fe" }}>{(d.hours / headcount).toFixed(0)}h</td>
                      <td style={{ padding: "10px 12px", color: "#a5b4fc" }}>{pct}%</td>
                      <td style={{ padding: "10px 12px", borderRadius: "0 8px 8px 0" }}>
                        <div style={{ background: "rgba(99,102,241,0.15)", borderRadius: 6, height: 20, overflow: "hidden" }}>
                          <div style={{
                            width: `${pct}%`, height: "100%", borderRadius: 6,
                            background: `linear-gradient(90deg, ${DEPT_COLORS[d.department]}cc, ${DEPT_COLORS[d.department]}88)`,
                            transition: "width 0.5s"
                          }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 40, paddingTop: 20, borderTop: "1px solid rgba(99,102,241,0.15)", fontSize: 12, color: "#4c4681" }}>
        Fandora 工作日誌 Dashboard — 資料期間 2025/09 ~ 2026/01 — 共 {DATA.summary.totalEntries.toLocaleString()} 筆紀錄
      </div>
    </div>
  );
}