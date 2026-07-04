import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast, Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone, FiMapPin, } from "react-icons/fi";
import "../../../App.css";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!formData.contact.trim()) return toast.error("Contact is required");
    if (!formData.address.trim()) return toast.error("Address is required");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm() !== true) return;

    setIsLoading(true);

    try {
      const user = await handleRegister(formData);

      console.log("Backend response:", user);

      toast.success("Successfully registered!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to register. Please try again.";

      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col lg:flex-row relative font-sans">
      <Toaster position="top-right" />

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-zinc-950/70 to-[#0f0f0f]" />

        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 flex items-center justify-center">
            <span className="text-[#d4af37] font-serif text-lg font-bold">
              B
            </span>
          </div>

          <div>
            <h1 className="text-white text-base font-semibold tracking-widest uppercase">
              BookMyStay
            </h1>
            <p className="text-[#d4af37] text-[8px] tracking-[0.3em] uppercase">
              Hotels • Travels • Rooms
            </p>
          </div>
        </div>

        <div className="relative z-20 max-w-md space-y-5">
          <p className="inline-block px-3 py-1 border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37] text-[9px] uppercase tracking-[0.2em] rounded-full">
            Discover. Book. Relax.
          </p>

          <h2 className="font-serif text-5xl font-light leading-tight">
            Discover Your <br />
            <span className="text-[#d4af37] font-semibold">
              Luxury Retreat
            </span>
          </h2>

          <p className="text-sm text-[#a1a1aa] leading-relaxed">
            Book premium hotels, beautiful rooms, and unforgettable travel stays
            with BookMyStay.
          </p>
        </div>

        <p className="relative z-20 text-[10px] text-zinc-500">
          © {new Date().getFullYear()} BookMyStay. All rights reserved.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[520px] bg-[#18181b]/80 border border-[#27272a] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-white text-lg tracking-widest uppercase font-semibold">
              BookMyStay
            </h1>
            <p className="text-[#d4af37] text-[9px] tracking-[0.3em] uppercase">
              Hotels • Travels • Rooms
            </p>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-light">
              Create an Account
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Fill in your details to start booking your perfect stay.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              icon={<FiUser />}
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Md Dilshad"
            />

            <Input
              icon={<FiMail />}
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />

            <div>
              <label className="text-xs uppercase tracking-widest text-[#a1a1aa]">
                Password
              </label>

              <div className="relative mt-1.5">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FiLock />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/40 border border-[#27272a] focus:border-[#d4af37] outline-none rounded-xl pl-10 pr-10 py-3 text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <Input
              icon={<FiPhone />}
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="9876543210"
            />

            <Input
              icon={<FiMapPin />}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Patna, Bihar"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#d4af37] text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-[#cda62d] transition disabled:opacity-60"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-xs text-[#a1a1aa]">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#d4af37] font-semibold underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({ icon, label, ...props }) => {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[#a1a1aa]">
        {label}
      </label>

      <div className="relative mt-1.5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
          {icon}
        </span>

        <input
          {...props}
          className="w-full bg-zinc-950/40 border border-[#27272a] focus:border-[#d4af37] outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600"
        />
      </div>
    </div>
  );
};

export default Register;