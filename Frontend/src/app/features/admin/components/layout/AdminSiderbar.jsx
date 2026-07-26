import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import {
  FiGrid,
  FiHome,
  FiLayers,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiUsers,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const links = [
  { label: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
  { label: "Hotels", path: "/admin/hotels", icon: FiHome },
  { label: "Rooms", path: "/admin/rooms", icon: FiLayers },
  { label: "Bookings", path: "/admin/bookings", icon: FiCalendar },
  { label: "Payments", path: "/admin/payments", icon: FiDollarSign },
  { label: "Reviews", path: "/admin/reviews", icon: FiStar },
  { label: "Users", path: "/admin/users", icon: FiUsers },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const logoutUser = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Admin sidebar logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed top-0 left-0 w-72 min-h-screen bg-[#0b0c10] border-r border-zinc-800 p-6 flex flex-col justify-between z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-6 right-6 w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <FiX size={18} />
        </button>
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0c960] flex items-center justify-center text-[#0b0c10] font-black text-lg">
            B
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide font-sans m-0 leading-tight">
              Book<span className="text-[#d4af37]">MyStay</span>
            </h2>
            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 m-0 mt-0.5 font-bold">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation Section Label */}
        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-4 px-2">
          Main Navigation
        </p>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-semibold border ${
                  isActive
                    ? "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20 shadow-[0_4px_20px_rgba(212,175,55,0.05)]"
                    : "text-zinc-500 border-transparent hover:text-zinc-200 hover:bg-zinc-900/60"
                }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-6 border-t border-zinc-900">
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 text-sm font-semibold cursor-pointer"
        >
          <FiLogOut className="text-lg flex-shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;