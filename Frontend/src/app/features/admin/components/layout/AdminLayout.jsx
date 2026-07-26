import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSiderbar";

const AdminLayout = ({ title, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="md:ml-72">
        <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 md:p-8 overflow-x-auto" style={{ paddingTop: "100px" }}>
          <h1 className="text-2xl md:text-4xl font-serif text-[#d4af37] mb-6 md:mb-8">
            {title}
          </h1>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;