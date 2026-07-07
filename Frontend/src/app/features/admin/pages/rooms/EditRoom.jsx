import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import AdminLayout from "../../components/layout/AdminLayout";
import {
  getRoomById,
  updateRoom,
  getHotels,
} from "../../service/admin.api";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hotel: "",
    roomType: "",
    pricePerNight: "",
    totalRooms: "",
    availableRooms: "",
    capacity: "",
    amenities: "",
    status: "available",
    imageUrl: "",
  });

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const hotelData = await getHotels();
        setHotels(hotelData.hotels || []);

        const data = await getRoomById(id);
        const room = data.room;

        setFormData({
          hotel: room.hotel?._id || room.hotel || "",
          roomType: room.roomType || "",
          pricePerNight: room.pricePerNight || "",
          totalRooms: room.totalRooms || "",
          availableRooms: room.availableRooms || "",
          capacity: room.capacity || "",
          amenities: room.amenities?.join(", ") || "",
          status: room.status || "available",
          imageUrl: room.images?.[0]?.url || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load room details");
      }
    };

    loadRoom();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      hotel: formData.hotel,
      roomType: formData.roomType,
      pricePerNight: Number(formData.pricePerNight),
      totalRooms: Number(formData.totalRooms),
      availableRooms: Number(formData.availableRooms),
      capacity: Number(formData.capacity),
      status: formData.status,
      images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);
      await updateRoom(id, payload);
      toast.success("Room updated successfully!");
      setTimeout(() => navigate("/admin/rooms"), 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Room update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#111216", color: "#fff", border: "1px solid #27272a" },
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8 animate-[fadeUp_0.5s_ease_both]">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-serif text-[#d4af37]">
            Edit Room
          </h1>
          <p className="text-zinc-400 mt-2">
            Update room pricing details, current availability status, or attributes.
          </p>
        </div>

        {/* Form Panel */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111216] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2.5 text-xs font-bold tracking-wide text-zinc-400 uppercase">
                Hotel
              </label>
              <select
                name="hotel"
                value={formData.hotel}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3.5 outline-none text-sm text-white focus:border-[#d4af37] transition"
              >
                <option value="">Select Hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Room Type" name="roomType" value={formData.roomType} onChange={handleChange} />
            <Input label="Price Per Night" type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} />
            <Input label="Total Rooms" type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} />
            <Input label="Available Rooms" type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} />
            <Input label="Capacity" type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
            <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required={false} placeholder="Paste room image link here" />
          </div>

          <TextArea
            label="Amenities (Comma separated)"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g. WiFi, AC, TV, Mini Bar, Safe"
            required={false}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2.5 text-xs font-bold tracking-wide text-zinc-400 uppercase">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3.5 outline-none text-sm text-white focus:border-[#d4af37] transition"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-zinc-800/80">
            <Link
              to="/admin/rooms"
              className="flex-1 sm:flex-initial text-center border border-zinc-800 text-zinc-400 px-8 py-3.5 rounded-2xl font-bold hover:text-white hover:border-zinc-700 transition"
            >
              Cancel
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="flex-2 sm:flex-initial bg-gradient-to-br from-[#d4af37] to-[#f0c960] text-[#0b0c10] px-10 py-3.5 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-[0_4px_18px_rgba(212,175,55,0.25)]"
            >
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

const Input = ({ label, required = true, ...props }) => (
  <div>
    <label className="block mb-2.5 text-xs font-bold tracking-wide text-zinc-400 uppercase">
      {label}
    </label>
    <input
      {...props}
      required={required}
      className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3.5 outline-none text-sm text-white focus:border-[#d4af37] transition"
    />
  </div>
);

const TextArea = ({ label, required = true, ...props }) => (
  <div>
    <label className="block mb-2.5 text-xs font-bold tracking-wide text-zinc-400 uppercase">
      {label}
    </label>
    <textarea
      {...props}
      required={required}
      rows={4}
      className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3.5 outline-none text-sm text-white focus:border-[#d4af37] transition"
    />
  </div>
);

export default EditRoom;