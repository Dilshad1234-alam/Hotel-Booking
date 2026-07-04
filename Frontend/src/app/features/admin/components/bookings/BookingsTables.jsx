import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";

import { useAdmin } from "../../hooks/useAdmin";

const BookingsTable = () => {
  const { handleGetBookings } = useAdmin();

  const { bookings, loading } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetBookings();
  }, [handleGetBookings]);

  console.log("Bookings:", bookings);

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

  if (loading) {
    return (
      <p className="text-zinc-400">
        Loading bookings...
      </p>
    );
  }

  return (
    <div className="space-y-6">

      {/* Search */}
      <div className="relative w-full md:w-96">
        <FiSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-zinc-500
          "
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search bookings..."
          className="
            w-full
            bg-[#18181b]
            border
            border-[#27272a]
            rounded-2xl
            pl-11
            pr-4
            py-3
            outline-none
            focus:border-[#d4af37]
          "
        />
      </div>

      {/* Cards */}
      <div className="grid gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="
              bg-[#18181b]
              border
              border-[#27272a]
              rounded-3xl
              p-6
            "
          >
            <div className="flex justify-between items-start">

              <div>
                <h2
                  className="
                    text-xl
                    font-serif
                    text-white
                  "
                >
                  {booking.user?.fullname ||
                    "Guest"}
                </h2>

                <p className="text-zinc-400 mt-1">
                  {booking.hotel?.name}
                </p>

                <p className="text-zinc-500 text-sm">
                  {booking.room?.roomType}
                </p>
              </div>

              <span
                className={`
                  px-4 py-1 rounded-full text-sm
                  ${
                    booking.status ===
                    "approved"
                      ? "bg-green-500/10 text-green-400"
                      : booking.status ===
                        "pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : booking.status ===
                        "cancelled"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                  }
                `}
              >
                {booking.status}
              </span>
            </div>

            <div
              className="
                grid
                md:grid-cols-4
                gap-4
                mt-6
              "
            >
              <Info
                icon={<FiCalendar />}
                label="Check In"
                value={new Date(
                  booking.checkIn
                ).toLocaleDateString()}
              />

              <Info
                icon={<FiCalendar />}
                label="Check Out"
                value={new Date(
                  booking.checkOut
                ).toLocaleDateString()}
              />

              <Info
                icon={<FiUsers />}
                label="Guests"
                value={booking.guests}
              />

              <Info
                icon={<FiDollarSign />}
                label="Total Price"
                value={`₹${booking.totalPrice}`}
              />
            </div>

            <div
              className="
                flex
                justify-between
                items-center
                mt-6
                pt-4
                border-t
                border-[#27272a]
              "
            >
              <span
                className={`
                  text-sm px-3 py-1 rounded-full
                  ${
                    booking.paymentStatus ===
                    "paid"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }
                `}
              >
                Payment:
                {" "}
                {booking.paymentStatus}
              </span>

              <div className="flex gap-2">

                <button
                  className="
                    w-10 h-10
                    rounded-xl
                    border
                    border-[#27272a]
                    flex
                    items-center
                    justify-center
                    hover:border-[#d4af37]
                  "
                >
                  <FiEdit2 />
                </button>

                <button
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-red-500/10
                    text-red-400
                    border
                    border-red-500/20
                  "
                >
                  <FiTrash2 />
                </button>

              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const Info = ({
  icon,
  label,
  value,
}) => (
  <div
    className="
      bg-[#0f0f0f]
      border
      border-[#27272a]
      rounded-2xl
      p-4
    "
  >
    <div className="text-[#d4af37] mb-2">
      {icon}
    </div>

    <p className="text-zinc-500 text-xs">
      {label}
    </p>

    <h4 className="text-white font-semibold mt-1">
      {value}
    </h4>
  </div>
);

export default BookingsTable;