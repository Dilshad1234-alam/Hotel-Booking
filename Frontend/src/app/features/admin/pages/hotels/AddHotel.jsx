import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";
import { createHotel, uploadImage, } from "../../service/admin.api";

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
    imageUrl: "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      const data = await uploadImage(file);

      console.log("UPLOAD RESPONSE:", data);

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));

      setPreview(data.url);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Image upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        city: formData.city,
        address: formData.address,
        rating: Number(formData.rating),
        status: formData.status,

        images: formData.imageUrl
          ? [{ url: formData.imageUrl }]
          : [],

        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createHotel(payload);

      navigate("/admin/hotels");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create hotel"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-[#d4af37]">
            Add New Hotel
          </h1>

          <p className="text-zinc-400 mt-2">
            Create and manage hotel properties.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            bg-[#18181b]
            border
            border-[#27272a]
            rounded-3xl
            p-8
            space-y-6
          "
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Hotel Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Taj Palace"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Mumbai"
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Colaba"
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Gateway of India"
            />

            <Input
              label="Rating"
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Hotel Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="
                  w-full
                  bg-[#0f0f0f]
                  border
                  border-[#27272a]
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#d4af37]
                "
              />
            </div>
          </div>

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Luxury sea-facing hotel..."
          />

          <TextArea
            label="Amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="WiFi, Pool, Gym, Parking"
            required={false}
          />

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full
                bg-[#0f0f0f]
                border
                border-[#27272a]
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-[#d4af37]
              "
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {preview && (
            <div>
              <p className="text-zinc-400 mb-3">
                Preview
              </p>

              <img
                src={preview}
                alt="Preview"
                className="
                  w-full
                  h-80
                  object-cover
                  rounded-3xl
                  border
                  border-[#27272a]
                "
              />
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="
              bg-[#d4af37]
              text-black
              px-8
              py-3
              rounded-2xl
              font-semibold
              hover:opacity-90
              disabled:opacity-60
            "
          >
            {loading ? "Please wait..." : "Create Hotel"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

function Input({ label, required = true, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-zinc-400">
        {label}
      </label>

      <input
        {...props}
        required={required}
        className="
          w-full
          bg-[#0f0f0f]
          border
          border-[#27272a]
          rounded-2xl
          px-4
          py-3
          outline-none
          focus:border-[#d4af37]
        "
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
      <label className="block mb-2 text-sm text-zinc-400">
        {label}
      </label>

      <textarea
        {...props}
        required={required}
        rows={4}
        className="
          w-full
          bg-[#0f0f0f]
          border
          border-[#27272a]
          rounded-2xl
          px-4
          py-3
          outline-none
          focus:border-[#d4af37]
        "
      />
    </div>
  );
}

export default AddHotel;