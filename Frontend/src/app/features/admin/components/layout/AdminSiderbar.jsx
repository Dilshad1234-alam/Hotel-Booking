import { NavLink } from "react-router-dom";

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["Hotels", "/admin/hotels"],
  ["Rooms", "/admin/rooms"],
  ["Bookings", "/admin/bookings"],
  ["Payments", "/admin/payments"],
  ["Reviews", "/admin/reviews"],
  ["Users", "/admin/users"],
];

const AdminSidebar = () => {
  return (
    <aside className=" fixed top-0 left-0 w-72 min-h-screen bg-[#18181b] border-r border-[#27272a] p-6 hidden md:block ">
      <h2 className="text-3xl text-[#d4af37] font-serif mb-2">
        BookMyStay
      </h2>

      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-10">
        Admin Panel
      </p>

      <nav className="space-y-2">
        {links.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition text-sm ${
                isActive
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;