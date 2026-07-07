import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiStar, FiLayers } from "react-icons/fi";
import { useAdmin } from "../../hooks/useAdmin";
import { Link } from "react-router-dom";
import { deleteHotel } from "../../service/admin.api";
import toast, { Toaster } from "react-hot-toast";

const HotelsTable = () => {
  const { handleGetHotels } = useAdmin();
  const { hotels, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetHotels();
  }, [handleGetHotels]);

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name || hotel.title || ""} ${hotel.city || ""} ${hotel.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id, hotelName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${hotelName || "this hotel"}"?\nThis action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deleteHotel(id);
      toast.success("Hotel deleted successfully");
      await handleGetHotels();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete hotel");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin" />
        <p>Loading hotel properties...</p>
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

      {/* Control Actions Panel */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-[#111216] border border-zinc-800 p-4 rounded-3xl">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotels by name, city, location..."
            className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none text-sm text-white focus:border-[#d4af37] transition"
          />
        </div>

        <Link
          to="/admin/hotels/create"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-[#d4af37] to-[#f0c960] text-[#0b0c10] px-6 py-3.5 rounded-2xl font-bold hover:opacity-90 transition shadow-[0_4px_18px_rgba(212,175,55,0.25)]"
        >
          <FiPlus /> Add Hotel
        </Link>
      </div>

      {filteredHotels.length === 0 ? (
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-16 text-center text-zinc-500">
          <div className="text-4xl mb-4">🏨</div>
          <h3 className="text-white text-lg font-bold">No Hotels Found</h3>
          <p className="text-sm mt-1">Try refining your search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => (
            <div
              key={hotel._id}
              className="group bg-[#111216] border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#d4af37]/40 transition-all duration-300 hover:translate-y-[-4px]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Card Image Area */}
              <div className="h-56 bg-[#0b0c10] overflow-hidden relative">
                <img
                  src={
                    hotel.images?.[0]?.url ||
                    hotel.image ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-[#d4af37] text-[#0b0c10] px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md">
                  <FiStar fill="currentColor" className="text-xs" />
                  <span>{hotel.rating || 0}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div>
                  <h3 className="text-xl font-serif text-white group-hover:text-[#d4af37] transition truncate">
                    {hotel.name || hotel.title || "Untitled Hotel"}
                  </h3>

                  <p className="text-zinc-400 text-xs flex items-center gap-1.5 mt-2.5 font-medium">
                    <FiMapPin className="text-[#d4af37]" />
                    <span>{hotel.city || hotel.location || hotel.address || "-"}</span>
                  </p>
                </div>

                <p className="text-zinc-500 text-xs mt-4 line-clamp-2 leading-relaxed">
                  {hotel.description || "Premium hotel property listed on BookMyStay."}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {(hotel.amenities || []).slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="text-[10px] bg-[#0b0c10] border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                  {(hotel.amenities || []).length > 3 && (
                    <span className="text-[10px] bg-[#0b0c10] border border-zinc-800 text-zinc-500 px-2 py-1 rounded-full font-bold">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-zinc-800/80 mt-6 pt-4 flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                    <FiLayers className="text-[#d4af37]" />
                    Rooms: <b className="text-white font-bold">{hotel.totalRooms || hotel.rooms?.length || 0}</b>
                  </span>

                  <div className="flex gap-2">
                    {/* View Details */}
                    <Link
                      to={`/admin/hotels/${hotel._id}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-all"
                    >
                      View
                    </Link>

                    {/* Edit Hotel */}
                    <Link
                      to={`/admin/hotels/edit/${hotel._id}`}
                      className="w-9 h-9 rounded-xl bg-[#0b0c10] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all"
                    >
                      <FiEdit2 size={14} />
                    </Link>

                    {/* Delete Hotel */}
                    <button
                      onClick={() => handleDelete(hotel._id, hotel.name)}
                      className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-all cursor-pointer"
                    >
                      <FiTrash2 size={14} />
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

export default HotelsTable;