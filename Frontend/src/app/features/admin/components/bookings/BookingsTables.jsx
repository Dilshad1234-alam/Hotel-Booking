import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiTrash2,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

import { useAdmin } from "../../hooks/useAdmin";
import { updateBookingStatus } from "../../service/admin.api";
import toast, { Toaster } from "react-hot-toast";

const BookingsTable = () => {
  const { handleGetBookings } = useAdmin();
  const { bookings, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetBookings();
  }, [handleGetBookings]);

  const filteredBookings = bookings.filter((booking) =>
    `
      ${booking.user?.fullname || ""}
      ${booking.hotel?.name || ""}
      ${booking.room?.roomType || ""}
      ${booking.status || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      await handleGetBookings();
    } catch (error) {
      console.log(error);
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id, guestName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the booking for "${guestName || "Guest"}"?`
    );

    if (!confirmDelete) return;

    try {
      toast.success("Booking deleted successfully");
      await handleGetBookings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete booking");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "approved") {
      return {
        bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        accent: "bg-emerald-500",
        icon: FiCheckCircle,
        label: "Approved",
      };
    }

    if (value === "checked_in") {
      return {
        bg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
        accent: "bg-cyan-500",
        icon: FiCheckCircle,
        label: "Checked In",
      };
    }

    if (value === "completed") {
      return {
        bg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        accent: "bg-blue-500",
        icon: FiCheckCircle,
        label: "Completed",
      };
    }

    if (value === "cancelled") {
      return {
        bg: "bg-red-500/10 text-red-400 border border-red-500/20",
        accent: "bg-red-500",
        icon: FiXCircle,
        label: "Cancelled",
      };
    }

    return {
      bg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      accent: "bg-amber-500",
      icon: FiClock,
      label: "Pending Approval",
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin" />
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeUp_0.5s_ease_both]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111216",
            color: "#fff",
            border: "1px solid #27272a",
          },
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-[#111216] border border-zinc-800 p-4 rounded-3xl">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest, hotel, room, status..."
            className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none text-sm text-white focus:border-[#d4af37] transition"
          />
        </div>

        <span className="text-[#d4af37] bg-[#d4af37]/10 text-xs font-semibold px-4 py-2 rounded-full border border-[#d4af37]/20">
          {filteredBookings.length} Total Bookings
        </span>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-16 text-center text-zinc-500">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-white text-lg font-bold">
            No Reservations Found
          </h3>
          <p className="text-sm mt-1">
            No bookings match the search criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking, index) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={booking._id}
                className="bg-[#111216] border border-zinc-800 rounded-3xl p-6 md:p-8 hover:border-[#d4af37]/30 transition duration-300 relative overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${statusConfig.accent}`}
                />

                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-xl font-serif text-white font-bold">
                      {booking.user?.fullname || "Guest"}
                    </h2>

                    <p className="text-[#d4af37] text-sm font-semibold mt-1">
                      {booking.hotel?.name || "Hotel Name"}
                    </p>

                    <p className="text-zinc-500 text-xs mt-1 font-medium">
                      Room Type:{" "}
                      <span className="text-zinc-400 font-bold">
                        {booking.room?.roomType || "N/A"}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig.bg}`}
                  >
                    <StatusIcon className="text-sm" />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Info
                    icon={<FiCalendar className="text-xs" />}
                    label="Check In"
                    value={formatDate(booking.checkInDate || booking.checkIn)}
                  />

                  <Info
                    icon={<FiCalendar className="text-xs" />}
                    label="Check Out"
                    value={formatDate(booking.checkOutDate || booking.checkOut)}
                  />

                  <Info
                    icon={<FiUsers className="text-xs" />}
                    label="Guests Count"
                    value={`${booking.guests || 1} Guests`}
                  />

                  <Info
                    icon={<FiDollarSign className="text-xs" />}
                    label="Total Price"
                    value={`₹${(booking.totalPrice || 0).toLocaleString(
                      "en-IN"
                    )}`}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-4">
                  <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
                    <span
                      className={`w-fit text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
                        booking.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      Payment: {booking.paymentStatus || "unpaid"}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {/* {booking.status !== "approved" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "approved")
                          }
                          className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition text-xs font-semibold"
                        >
                          Approve
                        </button>
                      )} */}

                      {booking.status !== "completed" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "completed")
                          }
                          className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-semibold"
                        >
                          Complete
                        </button>
                      )}

                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "cancelled")
                          }
                          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(booking._id, booking.user?.fullname)
                        }
                        className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition"
                        title="Delete Booking"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {booking.timeline?.length > 0 && (
                    <div className="bg-[#0b0c10] border border-zinc-800 rounded-2xl p-5">
                      <h3 className="text-[#d4af37] font-serif text-xl mb-4">
                        Booking Timeline
                      </h3>

                      <div className="space-y-4">
                        {booking.timeline.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-[#d4af37]" />
                              {idx !== booking.timeline.length - 1 && (
                                <div className="w-[2px] h-10 bg-zinc-800 mt-2" />
                              )}
                            </div>

                            <div>
                              <h4 className="text-white text-sm font-semibold">
                                {item.title}
                              </h4>

                              <p className="text-zinc-500 text-xs mt-1">
                                {item.note}
                              </p>

                              <p className="text-zinc-600 text-[11px] mt-1">
                                {item.date
                                  ? new Date(item.date).toLocaleString("en-IN")
                                  : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="bg-[#0b0c10] border border-zinc-800/60 rounded-2xl p-4">
    <div className="w-7 h-7 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-2.5">
      {icon}
    </div>

    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
      {label}
    </p>

    <h4 className="text-white font-bold text-sm mt-1">{value}</h4>
  </div>
);

export default BookingsTable;