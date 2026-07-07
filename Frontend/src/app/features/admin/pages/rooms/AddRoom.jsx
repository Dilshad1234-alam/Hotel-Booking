import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import AdminLayout from "../../components/layout/AdminLayout";
import { createRoom, getHotels } from "../../service/admin.api";

const AddRoom = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    hotel: "",
    roomType: "",
    pricePerNight: "",
    totalRooms: "",
    availableRooms: "",
    capacity: "",
    amenities: "",
    status: "available",
    image: null,
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     const payload = {
  //       hotel: formData.hotel,
  //       roomType: formData.roomType,
  //       pricePerNight: Number(formData.pricePerNight),
  //       totalRooms: Number(formData.totalRooms),
  //       availableRooms: Number(formData.availableRooms),
  //       capacity: Number(formData.capacity),
  //       images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
  //       amenities: formData.amenities
  //         .split(",")
  //         .map((item) => item.trim())
  //         .filter(Boolean),
  //       status: formData.status,
  //     };

  //     await createRoom(payload);
  //     toast.success("Room created successfully!");
  //     setTimeout(() => navigate("/admin/rooms"), 1000);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response?.data?.message || "Failed to create room");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleImageUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setFormData((prev) => ({
    ...prev,
    image: file,
  }));

  setPreview(URL.createObjectURL(file));
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = new FormData();

    payload.append("hotel", formData.hotel);
    payload.append("roomType", formData.roomType);
    payload.append("pricePerNight", formData.pricePerNight);
    payload.append("totalRooms", formData.totalRooms);
    payload.append("availableRooms", formData.availableRooms);
    payload.append("capacity", formData.capacity);
    payload.append("amenities", formData.amenities);
    payload.append("status", formData.status);

    if (formData.image) {
      payload.append("image", formData.image);
    }

    await createRoom(payload);

    toast.success("Room created successfully!");
    setTimeout(() => navigate("/admin/rooms"), 1000);
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to create room");
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
            Add New Room
          </h1>
          <p className="text-zinc-400 mt-2">
            Configure hotel rooms, capacity options, pricing, and availability details.
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

            <Input
              label="Room Type"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              placeholder="e.g. Executive Suite"
            />

            <Input
              label="Price Per Night"
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              placeholder="e.g. 8500"
            />

            <Input
              label="Total Rooms"
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleChange}
              placeholder="e.g. 15"
            />

            <Input
              label="Available Rooms"
              type="number"
              name="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
              placeholder="e.g. 15"
            />

            <Input
              label="Capacity (Max Guests)"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 3"
            />
          </div>

          {/* <Input
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Paste room image link here"
            required={false}
          /> */}


          <div>
  <label className="block mb-2.5 text-xs font-bold tracking-wide text-zinc-400 uppercase">
    Room Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white file:bg-[#d4af37] file:text-black file:border-0 file:px-4 file:py-2 file:rounded-xl file:mr-4"
  />

  {preview && (
    <div className="mt-4">
      <img
        src={preview}
        alt="Room Preview"
        className="w-full h-72 object-cover rounded-2xl border border-zinc-800"
      />
    </div>
  )}
</div>

          <TextArea
            label="Amenities (Comma separated)"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g. WiFi, AC, TV, Mini Bar, Sea View"
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
              {loading ? "Please wait..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

function Input({ label, required = true, ...props }) {
  return (
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
}

function TextArea({ label, required = true, ...props }) {
  return (
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
}

export default AddRoom;