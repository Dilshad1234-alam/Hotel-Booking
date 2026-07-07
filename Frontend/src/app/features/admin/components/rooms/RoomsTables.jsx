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
  FiTag,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import { deleteRoom } from "../../service/admin.api";
import toast, { Toaster } from "react-hot-toast";

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

  const handleDelete = async (id, roomType) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this "${roomType || "room"}" property?\nThis action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deleteRoom(id);
      toast.success("Room deleted successfully");
      await handleGetRooms();
    } catch (error) {
      console.error(error);
      toast.error("Room delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin" />
        <p>Loading rooms list...</p>
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
          style: { background: "#111216", color: "#fff", border: "1px solid #27272a" },
        }}
      />

      {/* Action / Search Panel */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-[#111216] border border-zinc-800 p-4 rounded-3xl">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms by type, hotel, status..."
            className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none text-sm text-white focus:border-[#d4af37] transition"
          />
        </div>

        <Link
          to="/admin/rooms/create"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-[#d4af37] to-[#f0c960] text-[#0b0c10] px-6 py-3.5 rounded-2xl font-bold hover:opacity-90 transition shadow-[0_4px_18px_rgba(212,175,55,0.25)]"
        >
          <FiPlus /> Add Room
        </Link>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-16 text-center text-zinc-500">
          <div className="text-4xl mb-4">🛏</div>
          <h3 className="text-white text-lg font-bold">No Rooms Found</h3>
          <p className="text-sm mt-1">Try searching by room type, hotel name, or status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => {
            const isAvail = room.status === "available" || room.availableRooms > 0;
            return (
              <div
                key={room._id}
                className="group bg-[#111216] border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#d4af37]/40 transition-all duration-300 hover:translate-y-[-4px]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Room Image Area */}
                <div className="h-52 bg-[#0b0c10] overflow-hidden relative">
                  <img
                    src={
                      room.images?.[0]?.url ||
                      room.image ||
                      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={room.roomType || room.type || "Room"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                  
                  {/* Status Overlay Badge */}
                  <span
                    className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                      isAvail
                        ? "bg-emerald-500/90 text-[#0b0c10]"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    {room.status || (isAvail ? "available" : "booked")}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div>
                    <h3 className="text-xl font-serif text-white group-hover:text-[#d4af37] transition truncate">
                      {room.roomType || room.type || "Untitled Room"}
                    </h3>

                    <p className="text-zinc-400 text-xs flex items-center gap-1.5 mt-2.5 font-medium truncate">
                      <FiHome className="text-[#d4af37]" />
                      <span>{room.hotel?.name || room.hotelName || "-"}</span>
                    </p>
                  </div>

                  {/* Room Parameters Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <Info
                      icon={<FiDollarSign className="text-xs" />}
                      label="Price / Night"
                      value={`₹${(room.price || room.pricePerNight || 0).toLocaleString("en-IN")}`}
                    />

                    <Info
                      icon={<FiUsers className="text-xs" />}
                      label="Capacity"
                      value={`${room.capacity || 0} Guests`}
                    />
                  </div>

                  <p className="text-zinc-500 text-xs mt-4 line-clamp-2 leading-relaxed">
                    {room.description || "Comfortable premium room listed on BookMyStay."}
                  </p>

                  {/* Footer Actions */}
                  <div className="border-t border-zinc-800/80 mt-6 pt-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                      <FiTag className="text-[#d4af37]" />
                      ID: <span className="font-mono text-zinc-400 select-all">{room._id?.slice(-8) || "N/A"}</span>
                    </span>

                    <div className="flex gap-2">
                      {/* Edit Room */}
                      <Link
                        to={`/admin/rooms/edit/${room._id}`}
                        className="w-9 h-9 rounded-xl bg-[#0b0c10] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all"
                      >
                        <FiEdit2 size={14} />
                      </Link>

                      {/* Delete Room */}
                      <button
                        onClick={() => handleDelete(room._id, room.roomType)}
                        className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-all cursor-pointer"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
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

const Info = ({ icon, label, value }) => (
  <div className="bg-[#0b0c10] border border-zinc-800/60 rounded-2xl p-4">
    <div className="w-7 h-7 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-2.5">
      {icon}
    </div>
    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
    <h4 className="text-white font-bold text-sm mt-1">{value}</h4>
  </div>
);

export default RoomsTable;