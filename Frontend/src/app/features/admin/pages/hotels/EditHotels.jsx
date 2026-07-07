import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
      try {
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
      } catch (error) {
        console.error(error);
        toast.error("Failed to load hotel details");
      }
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
      toast.success("Hotel updated successfully!");
      setTimeout(() => navigate("/admin/hotels"), 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Hotel update failed");
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
            Edit Hotel
          </h1>
          <p className="text-zinc-400 mt-2">
            Modify hotel details, rating, status, or configurations.
          </p>
        </div>

        {/* Form Panel */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111216] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Hotel Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            <Input label="Rating" type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} />
            <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required={false} placeholder="Paste image link here" />
          </div>

          <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} />

          <TextArea label="Amenities (Comma separated)" name="amenities" value={formData.amenities} onChange={handleChange} required={false} />

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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-zinc-800/80">
            <Link
              to="/admin/hotels"
              className="flex-1 sm:flex-initial text-center border border-zinc-800 text-zinc-400 px-8 py-3.5 rounded-2xl font-bold hover:text-white hover:border-zinc-700 transition"
            >
              Cancel
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="flex-2 sm:flex-initial bg-gradient-to-br from-[#d4af37] to-[#f0c960] text-[#0b0c10] px-10 py-3.5 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-[0_4px_18px_rgba(212,175,55,0.25)]"
            >
              {loading ? "Updating..." : "Update Hotel"}
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

export default EditHotel;