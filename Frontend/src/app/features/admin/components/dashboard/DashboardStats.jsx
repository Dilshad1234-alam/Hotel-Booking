import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAdmin } from "../../hooks/useAdmin";
import { Link } from "react-router-dom";

import {
  FiHome,
  FiGrid,
  FiUsers,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";

const DashboardStats = () => {
  const { handleGetDashboard } = useAdmin();
  const [time, setTime] = useState(new Date());

  const dashboard = useSelector((state) => state.admin.dashboard);
  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    handleGetDashboard();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [handleGetDashboard]);

  const stats = dashboard || {};
  const totalBookings = stats.totalBookings || 0;
  const pendingBookings = stats.pendingBookings || 0;
  const confirmedBookings = Math.max(0, totalBookings - pendingBookings);

  const confirmRate = totalBookings > 0
    ? Math.round((confirmedBookings / totalBookings) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin" />
        <p>Loading real-time stats...</p>
      </div>
    );
  }

  const cards = [
    {
      title: "TOTAL HOTELS",
      value: stats.totalHotels || 0,
      desc: "Properties registered",
      icon: FiHome,
      color: "text-[#d4af37]",
      bg: "bg-[#d4af37]/10",
      border: "hover:border-[#d4af37]/30",
    },
    {
      title: "TOTAL ROOMS",
      value: stats.totalRooms || 0,
      desc: "Rooms across properties",
      icon: FiGrid,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "hover:border-blue-400/30",
    },
    {
      title: "TOTAL USERS",
      value: stats.totalUsers || 0,
      desc: "Registered guests",
      icon: FiUsers,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "hover:border-purple-400/30",
    },
    {
      title: "TOTAL REVENUE",
      value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      desc: "Gross earnings",
      icon: FiDollarSign,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
      border: "hover:border-pink-400/30",
    },
  ];

  return (
    <div className="space-y-8 animate-[fadeUp_0.5s_ease_both]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#111216] via-[#16131d] to-[#111216] p-8 md:p-10 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-radial-gradient from-[#d4af37]/10 to-transparent rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] uppercase mb-2">
              ✦ Live Overview
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-white">
              Welcome Back, <span className="text-[#d4af37]">Admin</span>
            </h1>
            <p className="mt-3 text-zinc-400 text-base max-w-lg leading-relaxed">
              Monitor reservation stats, property inventory, secure payment orders, and guest feedback.
            </p>
          </div>

          {/* ClockWidget */}
          <div className="bg-[#0b0c10]/60 border border-zinc-800/80 rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center min-w-[180px] backdrop-blur-md">
            <span className="text-[#d4af37] text-2xl font-bold tracking-wider font-mono">
              {time.toLocaleTimeString()}
            </span>
            <span className="text-zinc-500 text-xs mt-1.5 font-semibold">
              {time.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-[#111216] border border-zinc-800 rounded-3xl p-7 transition-all duration-300 hover:translate-y-[-4px] ${card.border}`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                  <Icon className={`text-xl ${card.color}`} />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-zinc-500 bg-[#0b0c10] border border-zinc-800/60 px-2.5 py-1 rounded-full">
                  <FiTrendingUp className={card.color} />
                  <span>Live</span>
                </div>
              </div>

              <p className="text-[10px] tracking-[0.25em] text-zinc-500 font-bold mt-6">
                {card.title}
              </p>

              <h2 className="text-3.5xl font-bold text-white mt-3 font-sans leading-none">
                {card.value}
              </h2>

              <p className="text-zinc-400 text-xs mt-2 font-medium">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytics & Quick Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservation Status & Chart */}
        <div className="lg:col-span-2 bg-[#111216] border border-zinc-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Reservation Analytics
              </p>
              <h2 className="text-2xl font-serif text-white mt-1">
                Booking Status
              </h2>
            </div>
            <span className="text-[#d4af37] bg-[#d4af37]/10 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#d4af37]/25">
              {confirmRate}% Conversion Rate
            </span>
          </div>

          <div className="space-y-6">
            {/* ProgressBar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-400 font-semibold">
                <span>Confirmed ({confirmedBookings})</span>
                <span>Pending ({pendingBookings})</span>
              </div>
              <div className="h-3 w-full bg-[#0b0c10] rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${confirmRate}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                />
                <div
                  style={{ width: `${100 - confirmRate}%` }}
                  className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
              <div className="bg-[#0b0c10] border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <FiCheckCircle className="text-lg" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold">CONFIRMED</p>
                  <p className="text-white text-lg font-bold">{confirmedBookings}</p>
                </div>
              </div>

              <div className="bg-[#0b0c10] border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <FiClock className="text-lg" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold">PENDING</p>
                  <p className="text-white text-lg font-bold">{pendingBookings}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Management Shortcuts
            </p>
            <h2 className="text-2xl font-serif text-white mt-1 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <Link
                to="/admin/hotels/create"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0c10] border border-zinc-800 hover:border-[#d4af37]/40 transition text-zinc-300 hover:text-white"
              >
                <span className="text-sm font-semibold flex items-center gap-2.5">
                  <FiPlus className="text-[#d4af37]" /> Add New Hotel
                </span>
                <FiEye className="text-zinc-500 text-xs" />
              </Link>

              <Link
                to="/admin/rooms/create"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0c10] border border-zinc-800 hover:border-[#d4af37]/40 transition text-zinc-300 hover:text-white"
              >
                <span className="text-sm font-semibold flex items-center gap-2.5">
                  <FiPlus className="text-blue-400" /> Add New Room
                </span>
                <FiEye className="text-zinc-500 text-xs" />
              </Link>

              <Link
                to="/admin/bookings"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0c10] border border-zinc-800 hover:border-[#d4af37]/40 transition text-zinc-300 hover:text-white"
              >
                <span className="text-sm font-semibold flex items-center gap-2.5">
                  <FiCalendar className="text-emerald-400" /> Manage Stays
                </span>
                <FiEye className="text-zinc-500 text-xs" />
              </Link>
            </div>
          </div>

          <p className="text-zinc-500 text-[11px] font-medium mt-6 text-center leading-relaxed">
            Secure admin connection active.<br />Any inventory modifications reflect live on the guest portal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;