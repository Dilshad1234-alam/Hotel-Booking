import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";
import { createRoom, getHotels } from "../../service/admin.api";

const AddRoom = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);

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
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data.hotels || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        hotel: formData.hotel,
        roomType: formData.roomType,
        pricePerNight: Number(formData.pricePerNight),
        totalRooms: Number(formData.totalRooms),
        availableRooms: Number(formData.availableRooms),
        capacity: Number(formData.capacity),

        images: formData.imageUrl
          ? [{ url: formData.imageUrl }]
          : [],

        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        status: formData.status,
      };

      await createRoom(payload);

      navigate("/admin/rooms");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to create room"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Room">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-serif text-[#d4af37] mb-8">
          Add New Room
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#18181b] p-8 rounded-3xl space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-zinc-400">
                Hotel
              </label>

              <select
                name="hotel"
                value={formData.hotel}
                onChange={handleChange}
                required
                className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
              >
                <option value="">
                  Select Hotel
                </option>

                {hotels.map((hotel) => (
                  <option
                    key={hotel._id}
                    value={hotel._id}
                  >
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Room Type"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              placeholder="Deluxe Room"
            />

            <Input
              label="Price Per Night"
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
            />

            <Input
              label="Total Rooms"
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleChange}
            />

            <Input
              label="Available Rooms"
              type="number"
              name="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
            />

            <Input
              label="Capacity"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />

          </div>

          <Input
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            required={false}
          />

          <TextArea
            label="Amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="WiFi, AC, TV, Mini Bar"
            required={false}
          />

          <div>
            <label className="block mb-2 text-zinc-400">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
            >
              <option value="available">
                Available
              </option>

              <option value="unavailable">
                Unavailable
              </option>
            </select>
          </div>

          <button
            disabled={loading}
            className="bg-[#d4af37] text-black px-8 py-3 rounded-2xl font-semibold"
          >
            {loading
              ? "Creating..."
              : "Create Room"}
          </button>

        </form>
      </div>
    </AdminLayout>
  );
};

function Input({
  label,
  required = true,
  ...props
}) {
  return (
    <div>
      <label className="block mb-2 text-zinc-400">
        {label}
      </label>

      <input
        {...props}
        required={required}
        className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
      />
    </div>
  );
}

function TextArea({
  label,
  required = true,
  ...props
}) {
  return (
    <div>
      <label className="block mb-2 text-zinc-400">
        {label}
      </label>

      <textarea
        {...props}
        required={required}
        rows={4}
        className="w-full bg-[#0f0f0f] p-4 rounded-2xl border border-[#27272a]"
      />
    </div>
  );
}

export default AddRoom;