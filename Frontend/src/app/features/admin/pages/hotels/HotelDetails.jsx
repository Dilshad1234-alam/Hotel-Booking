import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { getHotelById } from "../../service/admin.api";

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function fetchHotel() {
      const data = await getHotelById(id);
      setHotel(data.hotel);
    }

    fetchHotel();
  }, [id]);

  if (!hotel) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <img
          src={
            hotel.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
          }
          className="w-full h-96 object-cover rounded-3xl border border-[#27272a]"
        />

        <div className="mt-8">
          <h1 className="text-5xl font-serif text-[#d4af37]">
            {hotel.name}
          </h1>

          <p className="text-zinc-400 mt-2">
            {hotel.city} • {hotel.location}
          </p>

          <p className="text-zinc-300 mt-6">
            {hotel.description}
          </p>

          <div className="flex gap-2 mt-6">
            {hotel.amenities?.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            to={`/admin/hotels/edit/${hotel._id}`}
            className="inline-block mt-8 bg-[#d4af37] text-black px-6 py-3 rounded-2xl"
          >
            Edit Hotel
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HotelDetails;