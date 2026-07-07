import { useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { smartHotelMatch } from "../service/user.api";

const AISmartMatch = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  const [formData, setFormData] = useState({
    budget: "",
    city: "",
    tripType: "Couple",
    hotelType: "Luxury",
    amenities: [],
  });

  const amenitiesList = ["Pool", "View", "Parking", "Food", "WiFi"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAmenity = (item) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("AI FORM DATA:", formData);

    try {
      setLoading(true);

      const data = await smartHotelMatch(formData);

      console.log("AI MATCH RESPONSE:", data);

      setMatches(data.matches || []);
    } catch (error) {
      console.log(error);
      alert("AI match failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <UserNavbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-8 mb-10">
          <p className="text-xs tracking-[0.3em] text-[#d4af37]">
            AI SMART MATCH
          </p>

          <h1 className="text-5xl font-serif mt-4">
            Find Your Perfect Stay
          </h1>

          <p className="text-zinc-400 mt-4">
            Answer a few questions and BookMyStay will recommend the best hotels for you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111216] border border-zinc-800 rounded-3xl p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Budget Per Night"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Example: 5000"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Example: Patna"
            />

            <Select
              label="Trip Type"
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              options={["Couple", "Family", "Solo"]}
            />

            <Select
              label="Hotel Type"
              name="hotelType"
              value={formData.hotelType}
              onChange={handleChange}
              options={["Luxury", "Budget", "Business"]}
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-3">
              Select Amenities
            </p>

            <div className="flex flex-wrap gap-3">
              {amenitiesList.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAmenity(item)}
                  className={`px-5 py-2 rounded-full border transition ${
                    formData.amenities.includes(item)
                      ? "bg-[#d4af37] text-black border-[#d4af37]"
                      : "bg-[#0b0c10] text-zinc-400 border-zinc-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="bg-[#d4af37] text-black px-8 py-4 rounded-2xl font-bold disabled:opacity-60"
          >
            {loading ? "Finding Best Hotels..." : "Find My Perfect Hotel"}
          </button>
        </form>

        <div className="mt-12">
          <h2 className="text-4xl font-serif text-[#d4af37] mb-6">
            Recommended Hotels
          </h2>

          {matches.length === 0 ? (
            <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-10 text-zinc-500">
              No recommendations yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {matches.map((item) => (
                <div
                  key={item.hotel._id}
                  className="bg-[#111216] border border-zinc-800 rounded-3xl overflow-hidden"
                >
                  <img
                    src={
                      item.hotel.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                    }
                    alt={item.hotel.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-serif">
                        {item.hotel.name}
                      </h3>

                      <span className="bg-[#d4af37] text-black px-3 py-1 rounded-full text-sm font-bold">
                        {item.matchPercentage}%
                      </span>
                    </div>

                    <p className="text-[#d4af37] mt-2">
                      {item.hotel.city} • {item.hotel.location}
                    </p>

                    <p className="text-zinc-400 mt-4">
                      Best Room: {item.bestRoom.roomType}
                    </p>

                    <p className="text-3xl font-serif text-[#d4af37] mt-3">
                      ₹{item.bestRoom.pricePerNight}
                    </p>

                    <div className="mt-5 space-y-2">
                      {item.reasons.map((reason, index) => (
                        <p
                          key={index}
                          className="text-sm text-zinc-400"
                        >
                          ✅ {reason}
                        </p>
                      ))}
                    </div>

                    <Link
                      to={`/hotels/${item.hotel._id}`}
                      className="block text-center mt-6 bg-[#d4af37] text-black py-3 rounded-2xl font-bold"
                    >
                      View Hotel
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-zinc-400 mb-2">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-[#d4af37]"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-zinc-400 mb-2">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-[#d4af37]"
    >
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
);

export default AISmartMatch;