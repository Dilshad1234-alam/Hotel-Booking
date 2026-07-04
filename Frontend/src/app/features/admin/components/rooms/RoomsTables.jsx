import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiHome,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import { deleteRoom } from "../../service/admin.api";


const RoomsTable = () => {
  const { handleGetRooms } = useAdmin();
  const { rooms, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetRooms();
  }, [handleGetRooms]);

  const filteredRooms = rooms.filter((room) =>
    `${room.roomType || room.type || ""} ${room.hotel?.name || ""} ${room.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

   const handleDelete = async (id) => {
  try {
    await deleteRoom(id);
    await handleGetRooms();
  } catch (error) {
    console.log(error);
    alert("Room delete failed");
  }
};
 

  if (loading) return <p className="text-zinc-400">Loading rooms...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms by type, hotel, status..."
            className="w-full bg-[#18181b] border border-[#27272a] rounded-2xl pl-11 pr-4 py-3 outline-none text-sm focus:border-[#d4af37]"
          />
        </div>

        <Link
          to="/admin/rooms/create"
          className="bg-[#d4af37] text-black px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 justify-center"
        >
          <FiPlus />
          Add Room
        </Link>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-10 text-center text-zinc-400">
          No rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden hover:border-[#d4af37]/50 transition"
            >
              <div className="h-48 bg-zinc-900 overflow-hidden">
                <img
                  src={
                    room.images?.[0]?.url ||
                    room.image ||
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={room.roomType || room.type || "Room"}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-serif text-white">
                      {room.roomType || room.type || "Room"}
                    </h3>

                    <p className="text-zinc-400 text-sm flex items-center gap-2 mt-2">
                      <FiHome className="text-[#d4af37]" />
                      {room.hotel?.name || room.hotelName || "-"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full h-fit ${
                      room.status === "available"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    }`}
                  >
                    {room.status || "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Info
                    icon={<FiDollarSign />}
                    label="Price"
                    value={`₹${room.price || 0}`}
                  />

                  <Info
                    icon={<FiUsers />}
                    label="Capacity"
                    value={room.capacity || 0}
                  />
                </div>

                <p className="text-zinc-500 text-sm mt-4 line-clamp-2">
                  {room.description || "Comfortable room listed on BookMyStay."}
                </p>

                <div className="border-t border-[#27272a] mt-5 pt-4 flex justify-end items-center">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/rooms/edit/${room._id}`}
                      className="w-9 h-9 rounded-xl bg-zinc-900 border border-[#27272a] flex items-center justify-center hover:border-[#d4af37]"
                    >
                      <FiEdit2 />
                    </Link>

                    <button
                      onClick={() => handleDelete(room._id)}
                      className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:border-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="bg-[#0f0f0f] border border-[#27272a] rounded-2xl p-4">
    <div className="text-[#d4af37] mb-2">{icon}</div>
    <p className="text-zinc-500 text-xs">{label}</p>
    <h4 className="text-white font-semibold mt-1">{value}</h4>
  </div>
);

export default RoomsTable;