import {
  FiBell,
  FiSearch,
  FiSettings,
  FiUser,
  FiLogOut,
  FiArrowLeft,
  FiMenu,
} from "react-icons/fi";

import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";

const AdminNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  const user = useSelector((state) => state.auth.user);

  const logoutUser = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const showBack = location.pathname !== "/admin/dashboard";

  return (
    <header className="fixed top-0 left-0 md:left-72 right-0 z-30 h-20 bg-[#0b0c10]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
      {/* Left Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 rounded-xl bg-[#111216] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] transition shadow-sm cursor-pointer"
        >
          <FiMenu size={18} />
        </button>

        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-[#111216] border border-zinc-800 hidden md:flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition shadow-sm cursor-pointer"
            title="Go Back"
          >
            <FiArrowLeft size={16} />
          </button>
        )}

        <div>
          <h1 className="text-xl md:text-2xl font-serif text-white flex items-center gap-1.5">
            Admin <span className="text-[#d4af37]">Panel</span>
          </h1>
          <p className="text-zinc-500 text-[11px] font-semibold mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-3 bg-[#111216] border border-zinc-800 px-3.5 py-1.5 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
            <FiUser className="text-base" />
          </div>

          <div className="hidden sm:block text-left">
            <h4 className="text-white text-xs font-semibold leading-tight">
              {user?.fullname || "Admin"}
            </h4>
            <p className="text-[10px] text-zinc-500 capitalize mt-0.5 leading-none">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <FiLogOut className="text-base" />
          <span className="hidden lg:block text-xs font-bold">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;