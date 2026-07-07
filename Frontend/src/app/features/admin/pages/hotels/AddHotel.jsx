import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import AdminLayout from "../../components/layout/AdminLayout";
import { createHotel } from "../../service/admin.api";

const AddHotel = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    address: "",
    image: null,
    amenities: "",
    rating: 0,
    status: "active",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   try {
  //     setLoading(true);
  //     const data = await uploadImage(file);
  //     console.log("UPLOAD RESPONSE:", data);

  //     setFormData((prev) => ({
  //       ...prev,
  //       imageUrl: data.url,
  //     }));
  //     setPreview(data.url);
  //     toast.success("Image uploaded successfully!");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.response?.data?.message || "Image upload failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);
  //     const payload = {
  //       name: formData.name,
  //       description: formData.description,
  //       location: formData.location,
  //       city: formData.city,
  //       address: formData.address,
  //       rating: Number(formData.rating),
  //       status: formData.status,
  //       images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
  //       amenities: formData.amenities
  //         .split(",")
  //         .map((item) => item.trim())
  //         .filter(Boolean),
  //     };

  //     await createHotel(payload);
  //     toast.success("Hotel created successfully!");
  //     setTimeout(() => navigate("/admin/hotels"), 1000);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.response?.data?.message || "Failed to create hotel");
  //   } finally {
  //     setLoading(false);
  //   }

  //   console.log("HOTEL PAYLOAD:", payload);
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

    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("location", formData.location);
    payload.append("city", formData.city);
    payload.append("address", formData.address);
    payload.append("rating", formData.rating);
    payload.append("status", formData.status);
    payload.append("amenities", formData.amenities);

    if (formData.image) {
      payload.append("image", formData.image);
    }

    await createHotel(payload);

    toast.success("Hotel created successfully!");

    setTimeout(() => {
      navigate("/admin/hotels");
    }, 1000);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to create hotel"
    );
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#d4af37]">
              Add New Hotel
            </h1>
            <p className="text-zinc-400 mt-2 ml-1">
              Create and configure new hotel properties for booking.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111216] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Hotel Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Taj Mahal Palace"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Apollo Bandar"
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Apollo Bandar, Colaba, Mumbai"
            />

            <Input
              label="Rating (0.0 to 5.0)"
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />

            {/* Custom styled file input */}
            <div>
              <label className="block mb-2.5 text-xs font-bold tracking-wide text-zinc-400 uppercase">
                Hotel Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="w-full bg-[#0b0c10] border border-zinc-800 hover:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-400 cursor-pointer flex items-center justify-between transition"
                >
                  <span className="truncate">
                    {preview ? "Change image" : "Choose file..."}
                  </span>
                  <FiUploadCloud className="text-[#d4af37] text-lg" />
                </label>
              </div>
            </div>
          </div>

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Introduce the hotel property, key features, nearby tourist attractions, etc..."
          />

          <TextArea
            label="Amenities (Comma separated)"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g. WiFi, Pool, Gym, Parking, Bar, AC"
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Preview panel */}
          {preview && (
            <div className="space-y-3">
              <label className="block text-xs font-bold tracking-wide text-zinc-400 uppercase">
                Image Preview
              </label>
              <div className="h-80 w-full overflow-hidden rounded-3xl border border-zinc-800 bg-[#0b0c10]">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

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
              {loading ? "Please wait..." : "Create Hotel"}
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

export default AddHotel;