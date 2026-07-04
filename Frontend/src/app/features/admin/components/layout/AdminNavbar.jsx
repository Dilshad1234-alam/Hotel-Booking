import {
  FiBell,
  FiSearch,
  FiSettings,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";

const AdminNavbar = () => {
  const navigate = useNavigate();
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

  return (
    <header className="fixed top-0 left-72 right-0 z-50 h-20 bg-[#0b0b0d]/90 backdrop-blur-xl border-b border-zinc-800 px-8 flex items-center justify-between">

      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-serif text-white">
          Admin{" "}
          <span className="text-[#d4af37]">
            Dashboard
          </span>
        </h1>

        <p className="text-zinc-500 text-sm mt-1">
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Center Search */}
      {/* <div className="hidden lg:flex items-center w-[400px] bg-[#111216] border border-zinc-800 rounded-2xl px-4 py-3">
        <FiSearch className="text-zinc-500 text-lg" />

        <input
          type="text"
          placeholder="Search hotels, bookings, users..."
          className="bg-transparent outline-none text-white ml-3 w-full placeholder:text-zinc-500"
        />
      </div> */}
      

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        {/* <button
          className="
            relative
            w-12 h-12
            rounded-2xl
            bg-[#111216]
            border border-zinc-800
            flex items-center justify-center
            hover:border-[#d4af37]
            transition
          "
        >
          <FiBell className="text-[#d4af37] text-xl" />

          <span
            className="
              absolute
              -top-1
              -right-1
              w-5 h-5
              rounded-full
              bg-red-500
              text-[10px]
              flex items-center justify-center
            "
          >
            3
          </span>
        </button> */}

        {/* Settings */}
        {/* <button
          className="
            w-12 h-12
            rounded-2xl
            bg-[#111216]
            border border-zinc-800
            flex items-center justify-center
            hover:border-[#d4af37]
            transition
          "
        >
          <FiSettings className="text-zinc-300 text-xl" />
        </button> */}

        {/* User */}
        <div
          className="
            flex items-center
            gap-3
            bg-[#111216]
            border border-zinc-800
            px-4 py-2
            rounded-2xl
          "
        >
          <div
            className="
              w-12 h-12
              rounded-full
              bg-[#d4af37]/20
              flex items-center justify-center
            "
          >
            <FiUser className="text-[#d4af37] text-xl" />
          </div>

          <div className="hidden md:block">
            <h4 className="text-white font-medium">
              {user?.fullname || "Admin"}
            </h4>

            <p className="text-xs text-zinc-500">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logoutUser}
          className="
            flex items-center
            gap-2
            px-5 py-3
            rounded-2xl
            bg-red-500/10
            border border-red-500/20
            text-red-400
            hover:bg-red-500/20
            transition
          "
        >
          <FiLogOut />
          <span className="hidden lg:block">
            Logout
          </span>
        </button>

      </div>
    </header>
  );
};

export default AdminNavbar;