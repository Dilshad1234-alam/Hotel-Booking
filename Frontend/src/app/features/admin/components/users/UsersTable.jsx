import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import { useAdmin } from "../../hooks/useAdmin";

const UsersTable = () => {
  const { handleGetUsers } = useAdmin();
  const { users, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetUsers();
  }, [handleGetUsers]);

  const filteredUsers = users.filter((user) =>
    `${user.fullname || ""} ${user.email || ""} ${user.contact || ""} ${user.role || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      customers: users.filter((u) => u.role === "user").length,
    };
  }, [users]);

  if (loading) return <p className="text-zinc-400">Loading users...</p>;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-5">
        <StatCard icon={<FiUsers />} title="Total Users" value={stats.total} />
        <StatCard icon={<FiShield />} title="Admins" value={stats.admins} />
        <StatCard icon={<FiUser />} title="Customers" value={stats.customers} />
      </div>

      <div className="relative w-full md:w-96">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-[#18181b] border border-[#27272a] rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-[#d4af37]"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-[#18181b] border border-dashed border-[#27272a] rounded-3xl p-16 text-center">
          <h2 className="text-2xl text-white">No Users Found</h2>
          <p className="text-zinc-500 mt-3">Registered users will appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 hover:border-[#d4af37]/40 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                    <FiUser size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-serif text-white">
                      {user.fullname || "Unknown User"}
                    </h3>

                    <p className="text-zinc-500 text-sm mt-1">
                      ID: {user._id?.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    user.role === "admin"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {user.role || "user"}
                </span>
              </div>

              <div className="space-y-3 mt-6">
                <Info icon={<FiMail />} label="Email" value={user.email || "-"} />
                <Info icon={<FiPhone />} label="Contact" value={user.contact || "-"} />
                <Info icon={<FiShield />} label="Role" value={user.role || "-"} />
              </div>

              <div className="border-t border-[#27272a] mt-6 pt-4 flex justify-between items-center">
                <span className="text-zinc-500 text-sm">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Registered"}
                </span>

                <button className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6">
    <div className="text-[#d4af37] text-2xl">{icon}</div>
    <p className="text-zinc-500 mt-4">{title}</p>
    <h2 className="text-3xl text-white font-bold mt-2">{value}</h2>
  </div>
);

const Info = ({ icon, label, value }) => (
  <div className="bg-[#0f0f0f] border border-[#27272a] rounded-2xl p-4 flex gap-3">
    <div className="text-[#d4af37] mt-1">{icon}</div>
    <div>
      <p className="text-zinc-500 text-xs">{label}</p>
      <h4 className="text-white mt-1 break-all">{value}</h4>
    </div>
  </div>
);

export default UsersTable;