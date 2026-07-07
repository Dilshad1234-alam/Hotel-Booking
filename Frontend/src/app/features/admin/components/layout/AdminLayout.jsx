import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSiderbar";

const AdminLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <AdminSidebar />

      <div className="md:ml-72">
        <AdminNavbar />

        <main className="p-6 md:p-8 overflow-x-auto" style={{ paddingTop: "120px" }}>
          <h1 className="text-3xl md:text-4xl font-serif text-[#d4af37] mb-8">
            {title}
          </h1>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;