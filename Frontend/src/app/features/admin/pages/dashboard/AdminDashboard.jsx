import AdminLayout from "../../components/layout/AdminLayout";
import DashboardStats from "../../components/dashboard/DashboardStats";

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <DashboardStats />
    </AdminLayout>
  );
};

export default AdminDashboard;










// import React, { useEffect, useState } from "react";
// import { useAdmin } from "../hooks/useAdmin.js";
// import { useSelector } from "react-redux";
// import {
//   FiHome,
//   FiUsers,
//   FiCalendar,
//   FiDollarSign,
//   FiClock,
//   FiGrid,
//   FiBell,
//   FiSettings,
//   FiLogOut,
//   FiTrendingUp,
//   FiActivity,
//   FiStar,
//   FiCheckCircle,
//   FiAlertCircle,
// } from "react-icons/fi";

// import "../../../App.css";

// const T = {
//   bg: "#0f0f0f",
//   surface: "#18181b",
//   border: "#27272a",
//   gold: "#d4af37",
//   muted: "#a1a1aa",
//   dim: "#71717a",
// };

// const GLOBAL_STYLE = `
//   .serif { font-family: serif; }

//   .sidebar-btn {
//     width:100%;
//     display:flex;
//     align-items:center;
//     gap:12px;
//     padding:11px 16px;
//     border-radius:12px;
//     border:none;
//     background:transparent;
//     cursor:pointer;
//     font-size:14px;
//     transition:background 0.2s, color 0.2s;
//   }

//   .sidebar-btn:hover {
//     background:rgba(255,255,255,0.05);
//     color:#fff;
//   }

//   .sidebar-btn.active {
//     background:rgba(212,175,55,0.1);
//     color:#d4af37;
//     border:1px solid rgba(212,175,55,0.2);
//   }

//   .fade-in { animation: fadeUp 0.6s ease both; }

//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(18px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .spin { animation: spin 0.9s linear infinite; }

//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }

//   .pulse-dot { animation: pulse 2s ease-in-out infinite; }

//   @keyframes pulse {
//     0%,100% { opacity:1; }
//     50% { opacity:0.3; }
//   }

//   .dashboard-main { margin-left: 260px; }

//   @media (max-width: 1023px) {
//     .lg-sidebar { display: none !important; }
//     .dashboard-main { margin-left: 0 !important; }
//   }
// `;

// const AnimatedNumber = ({ target }) => {
//   const [cur, setCur] = useState(0);

//   useEffect(() => {
//     let n = 0;
//     const finalValue = Number(target) || 0;

//     if (finalValue === 0) {
//       setCur(0);
//       return;
//     }

//     const step = finalValue / 60;

//     const id = setInterval(() => {
//       n = Math.min(n + step, finalValue);
//       setCur(Math.floor(n));

//       if (n >= finalValue) clearInterval(id);
//     }, 16);

//     return () => clearInterval(id);
//   }, [target]);

//   return <>{cur.toLocaleString("en-IN")}</>;
// };

// const fmt = (v) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(v ?? 0);

// const SidebarItem = ({ icon: Icon, label, active, badge, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`sidebar-btn${active ? " active" : ""}`}
//     style={{ color: active ? T.gold : T.muted }}
//   >
//     <Icon size={16} />
//     <span style={{ flex: 1, textAlign: "left" }}>{label}</span>

//     {badge !== undefined && (
//       <span
//         style={{
//           fontSize: 10,
//           fontWeight: 700,
//           padding: "2px 7px",
//           borderRadius: 99,
//           background: active ? "rgba(212,175,55,0.15)" : "#27272a",
//           color: active ? T.gold : T.muted,
//         }}
//       >
//         {badge}
//       </span>
//     )}
//   </button>
// );

// const StatCard = ({ icon: Icon, label, value, sub, color }) => (
//   <div
//     className="fade-in"
//     style={{
//       borderRadius: 18,
//       border: `1px solid ${T.border}`,
//       background: "rgba(24,24,27,0.85)",
//       padding: 24,
//     }}
//   >
//     <div style={{ display: "flex", justifyContent: "space-between" }}>
//       <div
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: 12,
//           background: `${color}20`,
//           color,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Icon />
//       </div>

//       <span
//         style={{
//           fontSize: 10,
//           textTransform: "uppercase",
//           letterSpacing: "0.18em",
//           color: T.dim,
//         }}
//       >
//         {label}
//       </span>
//     </div>

//     <p className="serif" style={{ fontSize: 32, marginTop: 18 }}>
//       <AnimatedNumber target={value} />
//     </p>

//     <p style={{ fontSize: 11, color: T.dim }}>{sub}</p>

//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 6,
//         fontSize: 11,
//         color,
//         marginTop: 14,
//       }}
//     >
//       <FiTrendingUp size={12} />
//       <span>Live data</span>
//     </div>
//   </div>
// );

// const AdminDashboard = () => {
//   const { handleGetDashboard } = useAdmin();

//   const dashboard = useSelector((state) => state.admin.dashboard);
//   const loading = useSelector((state) => state.admin.loading);

//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     handleGetDashboard();

//     const tick = setInterval(() => {
//       setTime(new Date());
//     }, 1000);

//     return () => clearInterval(tick);
//   }, [handleGetDashboard]);

//   const stats = {
//     totalHotels: 0,
//     totalRooms: 0,
//     totalUsers: 0,
//     totalBookings: 0,
//     pendingBookings: 0,
//     totalRevenue: 0,
//     ...(dashboard ?? {}),
//   };

//   const confirmed = stats.totalBookings - stats.pendingBookings;

//   const statCards = [
//     {
//       icon: FiHome,
//       label: "Total Hotels",
//       value: stats.totalHotels,
//       sub: "Properties registered",
//       color: T.gold,
//     },
//     {
//       icon: FiGrid,
//       label: "Total Rooms",
//       value: stats.totalRooms,
//       sub: "Rooms available",
//       color: "#60a5fa",
//     },
//     {
//       icon: FiUsers,
//       label: "Total Users",
//       value: stats.totalUsers,
//       sub: "Registered guests",
//       color: "#a78bfa",
//     },
//     {
//       icon: FiCalendar,
//       label: "Total Bookings",
//       value: stats.totalBookings,
//       sub: "All reservations",
//       color: "#34d399",
//     },
//     {
//       icon: FiClock,
//       label: "Pending",
//       value: stats.pendingBookings,
//       sub: "Awaiting confirmation",
//       color: "#f59e0b",
//     },
//     {
//       icon: FiDollarSign,
//       label: "Revenue",
//       value: stats.totalRevenue,
//       sub: fmt(stats.totalRevenue),
//       color: "#f472b6",
//     },
//   ];

//   return (
//     <>
//       <style>{GLOBAL_STYLE}</style>

//       <div
//         style={{
//           minHeight: "100vh",
//           background: T.bg,
//           color: "#fff",
//           display: "flex",
//         }}
//       >
//         <aside
//           className="lg-sidebar"
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             height: "100vh",
//             width: 260,
//             borderRight: `1px solid ${T.border}`,
//             background: T.bg,
//             padding: "24px 16px",
//             zIndex: 40,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
//             <div
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: "50%",
//                 border: "1px solid rgba(212,175,55,0.3)",
//                 background: "rgba(212,175,55,0.1)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <span className="serif" style={{ color: T.gold, fontSize: 18 }}>
//                 B
//               </span>
//             </div>

//             <div>
//               <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.2em" }}>
//                 BookMyStay
//               </p>
//               <p style={{ color: T.gold, fontSize: 8, letterSpacing: "0.3em" }}>
//                 ADMIN PANEL
//               </p>
//             </div>
//           </div>

//           <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//             <SidebarItem
//               icon={FiActivity}
//               label="Dashboard"
//               active={activeTab === "dashboard"}
//               onClick={() => setActiveTab("dashboard")}
//             />

//             <SidebarItem
//               icon={FiHome}
//               label="Hotels"
//               badge={stats.totalHotels}
//               active={activeTab === "hotels"}
//               onClick={() => setActiveTab("hotels")}
//             />

//             <SidebarItem
//               icon={FiGrid}
//               label="Rooms"
//               badge={stats.totalRooms}
//               active={activeTab === "rooms"}
//               onClick={() => setActiveTab("rooms")}
//             />

//             <SidebarItem
//               icon={FiUsers}
//               label="Users"
//               badge={stats.totalUsers}
//               active={activeTab === "users"}
//               onClick={() => setActiveTab("users")}
//             />

//             <SidebarItem
//               icon={FiCalendar}
//               label="Bookings"
//               badge={stats.totalBookings}
//               active={activeTab === "bookings"}
//               onClick={() => setActiveTab("bookings")}
//             />

//             <SidebarItem
//               icon={FiSettings}
//               label="Settings"
//               active={activeTab === "settings"}
//               onClick={() => setActiveTab("settings")}
//             />
//           </nav>

//           <div style={{ marginTop: 30 }}>
//             <button className="sidebar-btn" style={{ color: "#f87171" }}>
//               <FiLogOut />
//               <span>Log Out</span>
//             </button>
//           </div>
//         </aside>

//         <main className="dashboard-main" style={{ flex: 1, minHeight: "100vh" }}>
//           <header
//             style={{
//               position: "sticky",
//               top: 0,
//               zIndex: 30,
//               background: "rgba(15,15,15,0.85)",
//               borderBottom: `1px solid ${T.border}`,
//               padding: "16px 24px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <div>
//               <h2 className="serif" style={{ fontSize: 22 }}>
//                 Admin <span style={{ color: T.gold }}>Dashboard</span>
//               </h2>
//               <p style={{ fontSize: 11, color: T.dim }}>
//                 {time.toLocaleDateString("en-IN")}
//               </p>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <span style={{ color: T.muted, fontSize: 12 }}>
//                 {time.toLocaleTimeString()}
//               </span>

//               {stats.pendingBookings > 0 && (
//                 <span style={{ color: "#fbbf24", fontSize: 12 }}>
//                   <FiAlertCircle /> {stats.pendingBookings} pending
//                 </span>
//               )}

//               <FiBell color={T.gold} />
//             </div>
//           </header>

//           <div style={{ padding: "32px 24px", maxWidth: 1200 }}>
//             {loading && (
//               <div style={{ color: T.muted }}>
//                 <span className="spin">⏳</span> Fetching latest data...
//               </div>
//             )}

//             {activeTab === "dashboard" && (
//               <>
//                 <section
//                   className="fade-in"
//                   style={{
//                     borderRadius: 20,
//                     border: `1px solid ${T.border}`,
//                     background: "rgba(24,24,27,0.6)",
//                     padding: "32px 36px",
//                     marginBottom: 32,
//                   }}
//                 >
//                   <h3 className="serif" style={{ fontSize: 30 }}>
//                     Welcome to{" "}
//                     <span style={{ color: T.gold }}>BookMyStay Admin</span>
//                   </h3>

//                   <p style={{ color: T.muted, marginTop: 8 }}>
//                     Real-time overview of hotel booking operations.
//                   </p>
//                 </section>

//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//                     gap: 16,
//                   }}
//                 >
//                   {statCards.map((card) => (
//                     <StatCard key={card.label} {...card} />
//                   ))}
//                 </div>

//                 <section
//                   style={{
//                     marginTop: 32,
//                     borderRadius: 20,
//                     border: `1px solid ${T.border}`,
//                     background: T.surface,
//                     padding: 24,
//                   }}
//                 >
//                   <h3 className="serif" style={{ fontSize: 22, marginBottom: 10 }}>
//                     Booking Status
//                   </h3>

//                   <p style={{ color: "#34d399" }}>
//                     Confirmed Bookings: {confirmed}
//                   </p>

//                   <p style={{ color: "#f59e0b" }}>
//                     Pending Bookings: {stats.pendingBookings}
//                   </p>
//                 </section>
//               </>
//             )}

//             {activeTab === "hotels" && (
//               <Section title="Hotels Management" icon={FiHome}>
//                 <p>Total Hotels: {stats.totalHotels}</p>
//                 <p>Yahan hotels list, create, update, delete API connect karna hai.</p>
//               </Section>
//             )}

//             {activeTab === "rooms" && (
//               <Section title="Rooms Management" icon={FiGrid}>
//                 <p>Total Rooms: {stats.totalRooms}</p>
//                 <p>Yahan rooms list, create, update, delete API connect karna hai.</p>
//               </Section>
//             )}

//             {activeTab === "users" && (
//               <Section title="Users Management" icon={FiUsers}>
//                 <p>Total Users: {stats.totalUsers}</p>
//                 <p>Yahan users list, block/unblock, delete API connect karna hai.</p>
//               </Section>
//             )}

//             {activeTab === "bookings" && (
//               <Section title="Bookings Management" icon={FiCalendar}>
//                 <p>Total Bookings: {stats.totalBookings}</p>
//                 <p>Pending Bookings: {stats.pendingBookings}</p>
//                 <p>Yahan booking approve/cancel/complete API connect karna hai.</p>
//               </Section>
//             )}

//             {activeTab === "settings" && (
//               <Section title="Settings" icon={FiSettings}>
//                 <p>BookMyStay admin settings panel.</p>
//               </Section>
//             )}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// const Section = ({ title, icon: Icon, children }) => {
//   return (
//     <div
//       className="fade-in"
//       style={{
//         borderRadius: 20,
//         border: `1px solid ${T.border}`,
//         background: T.surface,
//         padding: 28,
//       }}
//     >
//       <h2
//         className="serif"
//         style={{
//           fontSize: 28,
//           color: T.gold,
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           marginBottom: 16,
//         }}
//       >
//         <Icon />
//         {title}
//       </h2>

//       <div style={{ color: T.muted, lineHeight: 1.8 }}>{children}</div>
//     </div>
//   );
// };

// export default AdminDashboard;