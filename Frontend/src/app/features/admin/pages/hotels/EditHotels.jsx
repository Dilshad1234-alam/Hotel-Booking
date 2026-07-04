import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { getHotelById, updateHotel } from "../../service/admin.api";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    address: "",
    imageUrl: "",
    amenities: "",
    rating: 0,
    status: "active",
  });

  useEffect(() => {
    async function loadHotel() {
      const data = await getHotelById(id);
      const hotel = data.hotel;

      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        location: hotel.location || "",
        city: hotel.city || "",
        address: hotel.address || "",
        imageUrl: hotel.images?.[0]?.url || "",
        amenities: hotel.amenities?.join(", ") || "",
        rating: hotel.rating || 0,
        status: hotel.status || "active",
      });
    }

    loadHotel();
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
      name: formData.name,
      description: formData.description,
      location: formData.location,
      city: formData.city,
      address: formData.address,
      rating: Number(formData.rating),
      status: formData.status,
      images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);
      await updateHotel(id, payload);
      navigate("/admin/hotels");
    } catch (error) {
      alert(error.response?.data?.message || "Hotel update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-8">
          Edit Hotel
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#18181b] border border-[#27272a] rounded-3xl p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Hotel Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            <Input label="Rating" type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} />
            <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required={false} />
          </div>

          <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} />

          <TextArea label="Amenities" name="amenities" value={formData.amenities} onChange={handleChange} required={false} />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-2xl px-4 py-3 outline-none focus:border-[#d4af37]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            disabled={loading}
            className="bg-[#d4af37] text-black px-8 py-3 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Hotel"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

const Input = ({ label, required = true, ...props }) => (
  <div>
    <label className="block mb-2 text-sm text-zinc-400">{label}</label>
    <input
      {...props}
      required={required}
      className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-2xl px-4 py-3 outline-none focus:border-[#d4af37]"
    />
  </div>
);

const TextArea = ({ label, required = true, ...props }) => (
  <div>
    <label className="block mb-2 text-sm text-zinc-400">{label}</label>
    <textarea
      {...props}
      required={required}
      rows={4}
      className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-2xl px-4 py-3 outline-none focus:border-[#d4af37]"
    />
  </div>
);

export default EditHotel;