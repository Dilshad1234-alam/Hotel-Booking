import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      navigate("/admin/rooms");
    } catch (error) {
      alert(error.response?.data?.message || "Room update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit Room">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-8">
          Edit Room
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#18181b] border border-[#27272a] rounded-3xl p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-zinc-400">Hotel</label>
              <select
                name="hotel"
                value={formData.hotel}
                onChange={handleChange}
                required
                className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
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
            <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required={false} />
          </div>

          <TextArea
            label="Amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="WiFi, AC, TV"
            required={false}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <button
            disabled={loading}
            className="bg-[#d4af37] text-black px-8 py-3 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Room"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

const Input = ({ label, required = true, ...props }) => (
  <div>
    <label className="block mb-2 text-zinc-400">{label}</label>
    <input
      {...props}
      required={required}
      className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
    />
  </div>
);

const TextArea = ({ label, required = true, ...props }) => (
  <div>
    <label className="block mb-2 text-zinc-400">{label}</label>
    <textarea
      {...props}
      required={required}
      rows={4}
      className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
    />
  </div>
);

export default EditRoom;