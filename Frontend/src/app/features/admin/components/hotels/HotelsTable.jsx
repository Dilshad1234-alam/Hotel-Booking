import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiStar } from "react-icons/fi";
import { useAdmin } from "../../hooks/useAdmin";
import { Link } from "react-router-dom"
import DeleteHotelModal from "../DeleteConfirModel"
import { deleteHotel } from "../../service/admin.api"

const HotelsTable = () => {
  const { handleGetHotels } = useAdmin();
  const { hotels, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    handleGetHotels();
  }, [handleGetHotels]);

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name || hotel.title || ""} ${hotel.city || ""} ${hotel.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

const handleDelete = async (id) => {
  try {
    await deleteHotel(id);

    // list refresh
    await handleGetHotels();

    console.log("Hotel deleted successfully");
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Failed to delete hotel");
  }
};

  if (loading) return <p className="text-zinc-400">Loading hotels...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotels by name, city, location..."
            className="w-full bg-[#18181b] border border-[#27272a] rounded-2xl pl-11 pr-4 py-3 outline-none text-sm focus:border-[#d4af37]"
          />
        </div>

        <Link
          to="/admin/hotels/create"
          className="bg-[#d4af37] text-black px-5 py-3 rounded-2xl"
        >
          Add Hotel
        </Link>
        
      </div>

      {filteredHotels.length === 0 ? (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-10 text-center text-zinc-400">
          No hotels found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden hover:border-[#d4af37]/50 transition"
            >
              <div className="h-52 bg-zinc-900 overflow-hidden">
                <img
                  src={
                    hotel.images?.[0]?.url ||
                    hotel.image ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-serif text-white">
                      {hotel.name || hotel.title || "Untitled Hotel"}
                    </h3>

                    <p className="text-zinc-400 text-sm flex items-center gap-2 mt-2">
                      <FiMapPin className="text-[#d4af37]" />
                      {hotel.city || hotel.location || hotel.address || "-"}
                    </p>
                  </div>

                  <div className="text-[#d4af37] flex items-center gap-1">
                    <FiStar />
                    {hotel.rating || 0}
                  </div>
                </div>

                <p className="text-zinc-500 text-sm mt-4 line-clamp-2">
                  {hotel.description || "Premium hotel property listed on BookMyStay."}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(hotel.amenities || []).slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="text-[11px] bg-[#0f0f0f] border border-[#27272a] text-zinc-400 px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="border-t border-[#27272a] mt-5 pt-4 flex justify-between items-center">
                  <span className="text-sm text-zinc-400">
                    Rooms: <b className="text-white">{hotel.totalRooms || hotel.rooms?.length || 0}</b>
                  </span>

                  <div className="flex gap-2">

                    {/* View Details */}
                    <Link
                      to={`/admin/hotels/${hotel._id}`}
                      className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20"
                    >
                      View
                    </Link>

                    {/* Edit Hotel */}
                    <Link
                      to={`/admin/hotels/edit/${hotel._id}`}
                      className="w-9 h-9 rounded-xl bg-zinc-900 border border-[#27272a] flex items-center justify-center hover:border-[#d4af37]"
                    >
                      <FiEdit2 />
                    </Link>

                    {/* Delete Hotel */}
                    <button
                      onClick={() => handleDelete(hotel._id)}
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

export default HotelsTable;