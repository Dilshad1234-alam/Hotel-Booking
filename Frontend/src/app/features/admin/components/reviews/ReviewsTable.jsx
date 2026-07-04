import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiStar,
  FiUser,
  FiHome,
  FiCheckCircle,
  FiClock,
  FiTrash2,
} from "react-icons/fi";

import { useAdmin } from "../../hooks/useAdmin";

const ReviewsTable = () => {
  const { handleGetReviews } = useAdmin();
  const { reviews, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetReviews();
  }, [handleGetReviews]);

  const filteredReviews = reviews.filter((review) =>
    `
      ${review.user?.fullname || review.userName || ""}
      ${review.hotel?.name || ""}
      ${review.comment || ""}
      ${review.status || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: reviews.length,
      approved: reviews.filter((r) => r.status === "approved").length,
      pending: reviews.filter((r) => r.status === "pending").length,
      deleted: reviews.filter((r) => r.status === "deleted").length,
    };
  }, [reviews]);

  if (loading) {
    return <p className="text-zinc-400">Loading reviews...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-5">
        <StatCard icon={<FiStar />} title="Total Reviews" value={stats.total} />
        <StatCard icon={<FiCheckCircle />} title="Approved" value={stats.approved} />
        <StatCard icon={<FiClock />} title="Pending" value={stats.pending} />
        <StatCard icon={<FiTrash2 />} title="Deleted" value={stats.deleted} />
      </div>

      <div className="relative w-full md:w-96">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="w-full bg-[#18181b] border border-[#27272a] rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-[#d4af37]"
        />
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-[#18181b] border border-dashed border-[#27272a] rounded-3xl p-16 text-center">
          <h2 className="text-2xl text-white">No Reviews Found</h2>
          <p className="text-zinc-500 mt-3">
            Customer reviews will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 hover:border-[#d4af37]/40 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-serif text-white flex items-center gap-2">
                    <FiUser className="text-[#d4af37]" />
                    {review.user?.fullname || review.userName || "Guest"}
                  </h3>

                  <p className="text-zinc-500 text-sm mt-2 flex items-center gap-2">
                    <FiHome className="text-[#d4af37]" />
                    {review.hotel?.name || "Hotel"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    review.status === "approved"
                      ? "bg-green-500/10 text-green-400"
                      : review.status === "deleted"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {review.status || "pending"}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-5 text-[#d4af37]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FiStar
                    key={index}
                    className={
                      index < (review.rating || 0)
                        ? "fill-[#d4af37]"
                        : "text-zinc-700"
                    }
                  />
                ))}

                <span className="ml-2 text-zinc-400 text-sm">
                  {review.rating || 0}/5
                </span>
              </div>

              <p className="text-zinc-400 mt-5 leading-relaxed">
                {review.comment || review.message || "-"}
              </p>

              <div className="border-t border-[#27272a] mt-6 pt-4 flex justify-between items-center">
                <span className="text-zinc-500 text-sm">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : "-"}
                </span>

                <button className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6">
    <div className="text-[#d4af37] text-2xl">{icon}</div>
    <p className="text-zinc-500 mt-4">{title}</p>
    <h2 className="text-3xl text-white font-bold mt-2">{value}</h2>
  </div>
);

export default ReviewsTable;











// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useAdmin } from "../../hooks/useAdmin";

// const ReviewsTable = () => {
//   const { handleGetReviews } = useAdmin();
//   const { reviews, loading } = useSelector((state) => state.admin);

//   useEffect(() => {
//     handleGetReviews();
//   }, [handleGetReviews]);

//   if (loading) return <p className="text-zinc-400">Loading reviews...</p>;

//   return (
//     <div className="space-y-4">
//       {reviews.map((review) => (
//         <div
//           key={review._id}
//           className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5"
//         >
//           <h3 className="font-semibold">
//             {review.user?.fullname || review.userName || "Guest"}
//           </h3>

//           <p className="text-[#d4af37] mt-1">
//             Rating: {review.rating || 0} ⭐
//           </p>

//           <p className="text-zinc-400 mt-2">
//             {review.comment || review.message || "-"}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ReviewsTable;