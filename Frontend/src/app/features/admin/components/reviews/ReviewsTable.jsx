import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiStar,
  FiUser,
  FiHome,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiCalendar,
  FiFilter,
  FiMessageSquare,
} from "react-icons/fi";

import { useAdmin } from "../../hooks/useAdmin";

const ReviewsTable = () => {
  const { handleGetReviews } = useAdmin();
  const { reviews, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    handleGetReviews();
  }, [handleGetReviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch = `
        ${review.user?.fullname || review.userName || ""}
        ${review.hotel?.name || ""}
        ${review.comment || review.message || ""}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

      const ratingNum = review.rating || 0;
      const matchesStar =
        starFilter === "all" || ratingNum.toString() === starFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (review.status || "pending").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStar && matchesStatus;
    });
  }, [reviews, search, starFilter, statusFilter]);

  const stats = useMemo(() => {
    const validReviews = reviews.filter((r) => r.rating > 0);
    const avg = validReviews.length
      ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
      : "0.0";

    return {
      total: reviews.length,
      average: avg,
      approved: reviews.filter((r) => r.status === "approved").length,
      pending: reviews.filter((r) => !r.status || r.status === "pending").length,
    };
  }, [reviews]);

  // Generate dynamic gradient avatar based on name initials
  const getAvatarBg = (name) => {
    const char = name ? name.charCodeAt(0) : 65;
    const colors = [
      "from-[#d4af37]/30 to-[#f0c960]/10 text-[#d4af37]",
      "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20",
      "from-rose-500/20 to-red-500/5 text-rose-400 border-rose-500/20",
      "from-blue-500/20 to-indigo-500/5 text-blue-400 border-blue-500/20",
      "from-purple-500/20 to-pink-500/5 text-purple-400 border-purple-500/20",
    ];
    return colors[char % colors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Retrieving reviews feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeUp_0.5s_ease_both]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header section with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-[#d4af37]">Customer Reviews Feed</h2>
          <p className="text-zinc-400 text-xs mt-1">Check visitor ratings, hotel feedbacks, and testimonial scores.</p>
        </div>
        <button
          onClick={() => handleGetReviews()}
          className="flex items-center gap-2 bg-[#111216] border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#d4af37]/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer"
        >
          <FiRefreshCw className="animate-hover-spin" /> Refresh Reviews
        </button>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<FiMessageSquare />}
          title="Total Reviews"
          value={stats.total}
          description="All feedback submissions"
          color="from-zinc-500/10 to-zinc-900/5 border-zinc-800"
        />
        <StatCard
          icon={<FiStar className="fill-[#d4af37] text-[#d4af37]" />}
          title="Average Rating"
          value={`${stats.average} / 5.0`}
          description="Overall customer satisfaction"
          color="from-amber-500/20 to-yellow-500/5 border-[#d4af37]/20"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="Approved Reviews"
          value={stats.approved}
          description="Published to hotel rooms"
          color="from-emerald-500/20 to-green-500/5 border-emerald-500/20"
        />
        <StatCard
          icon={<FiClock />}
          title="Pending Moderation"
          value={stats.pending}
          description="Awaiting system approval"
          color="from-rose-500/20 to-red-500/5 border-rose-500/20"
        />
      </div>

      {/* Filters Area */}
      <div className="bg-[#111216] border border-zinc-800 p-5 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, hotel name, review content..."
              className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none text-sm text-white focus:border-[#d4af37] transition"
            />
          </div>

          {/* Filtering selectors */}
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Rating Filter */}
            <div className="flex items-center gap-2 bg-[#0b0c10] border border-zinc-800 rounded-2xl px-3 py-2">
              <FiStar className="text-zinc-500 text-xs" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Rating:</span>
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-white cursor-pointer pr-4"
              >
                <option value="all">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-[#0b0c10] border border-zinc-800 rounded-2xl px-3 py-2">
              <FiCheckCircle className="text-zinc-500 text-xs" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-white cursor-pointer pr-4"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Grid of Testimonials */}
      {filteredReviews.length === 0 ? (
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-16 text-center text-zinc-500">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-white text-lg font-bold">No Reviews Found</h3>
          <p className="text-sm mt-1 max-w-md mx-auto">
            No matching customer reviews were found. Try modifying your search query or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map((review) => {
            const userName = review.user?.fullname || review.userName || "Guest";
            const avatarStyle = getAvatarBg(userName);
            const isApproved = review.status === "approved";

            return (
              <div
                key={review._id}
                className="group bg-[#111216] border border-zinc-800 hover:border-[#d4af37]/40 rounded-3xl p-6 transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Header info */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center font-bold text-base ${avatarStyle}`}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm truncate max-w-[140px] group-hover:text-[#d4af37] transition">
                          {userName}
                        </h4>
                        <p className="text-zinc-500 text-xs truncate max-w-[140px]">
                          {review.user?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {review.status || "pending"}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#d4af37] bg-[#0b0c10] border border-zinc-800/40 p-2.5 rounded-2xl w-fit">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FiStar
                        key={index}
                        size={13}
                        className={
                          index < (review.rating || 0)
                            ? "fill-[#d4af37] text-[#d4af37]"
                            : "text-zinc-700"
                        }
                      />
                    ))}
                    <span className="ml-2 font-bold text-xs text-zinc-400">
                      {review.rating || 0}.0
                    </span>
                  </div>

                  {/* Review Text / Testimonial content */}
                  <div className="relative">
                    <p className="text-zinc-300 text-sm leading-relaxed italic font-medium py-1">
                      "{review.comment || review.message || "No comment left."}"
                    </p>
                  </div>
                </div>

                {/* Footer containing hotel name and date */}
                <div className="border-t border-zinc-850 mt-5 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs">
                    <FiHome className="text-[#d4af37] flex-shrink-0" />
                    <span className="truncate font-semibold text-zinc-300">{review.hotel?.name || "Specified Hotel"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1">
                    <FiCalendar className="text-[#d4af37] flex-shrink-0" />
                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, description, color }) => (
  <div className={`bg-gradient-to-br ${color} border rounded-3xl p-6 relative overflow-hidden group shadow-lg`}>
    <div className="absolute right-4 top-4 w-12 h-12 bg-zinc-900/45 rounded-2xl flex items-center justify-center text-xl border border-zinc-800">
      {icon}
    </div>
    <div>
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl text-white font-extrabold mt-2 tracking-tight">{value}</h3>
      <p className="text-[11px] text-zinc-500 mt-2 font-medium">{description}</p>
    </div>
  </div>
);

export default ReviewsTable;