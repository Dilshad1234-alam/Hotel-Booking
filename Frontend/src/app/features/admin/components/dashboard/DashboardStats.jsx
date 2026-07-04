import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAdmin } from "../../hooks/useAdmin";

import {
  FiHome,
  FiGrid,
  FiUsers,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

const DashboardStats = () => {
  const { handleGetDashboard } = useAdmin();

  const dashboard = useSelector((state) => state.admin.dashboard);
  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    handleGetDashboard();
  }, [handleGetDashboard]);

  const stats = dashboard || {};

  if (loading) {
    return (
      <div className="text-zinc-400 text-lg">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "TOTAL HOTELS",
      value: stats.totalHotels || 0,
      desc: "Properties registered",
      icon: FiHome,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "TOTAL ROOMS",
      value: stats.totalRooms || 0,
      desc: "Rooms available",
      icon: FiGrid,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "TOTAL USERS",
      value: stats.totalUsers || 0,
      desc: "Registered guests",
      icon: FiUsers,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "TOTAL BOOKINGS",
      value: stats.totalBookings || 0,
      desc: "All reservations",
      icon: FiCalendar,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "PENDING",
      value: stats.pendingBookings || 0,
      desc: "Awaiting confirmation",
      icon: FiClock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "REVENUE",
      value: `₹${stats.totalRevenue || 0}`,
      desc: "Total earnings",
      icon: FiDollarSign,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome Banner */}
      <div className="rounded-3xl border border-zinc-800 bg-[#111216] p-10">
        <h1 className="text-5xl font-serif text-white">
          Welcome to{" "}
          <span className="text-[#d4af37]">
            BookMyStay Admin
          </span>
        </h1>

        <p className="mt-4 text-zinc-400 text-lg">
          Real-time overview of hotel booking operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-[#111216] border border-zinc-800 rounded-3xl p-8 hover:border-[#d4af37]/40 transition"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}
              >
                <Icon
                  className={`text-2xl ${card.color}`}
                />
              </div>

              <p className="text-xs tracking-[0.3em] text-zinc-500 mt-6">
                {card.title}
              </p>

              <h2 className="text-5xl font-serif text-white mt-4">
                {card.value}
              </h2>

              <p className="text-zinc-500 mt-3">
                {card.desc}
              </p>

              <div
                className={`flex items-center gap-2 mt-5 text-sm ${card.color}`}
              >
                <FiTrendingUp />
                <span>Live data</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Status */}
      <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-8">
        <h2 className="text-3xl font-serif text-white mb-6">
          Booking Status
        </h2>

        <p className="text-emerald-400 text-xl mb-2">
          Confirmed Bookings:{" "}
          {stats.totalBookings -
            stats.pendingBookings}
        </p>

        <p className="text-yellow-400 text-xl">
          Pending Bookings:{" "}
          {stats.pendingBookings || 0}
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;