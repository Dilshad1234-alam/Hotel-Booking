import AdminLayout from "../../components/layout/AdminLayout";
import HotelsTable from "../../components/hotels/HotelsTable";

const AdminHotels = () => {
  return (
    <AdminLayout title="Hotels">
      <HotelsTable />
    </AdminLayout>
  );
};

export default AdminHotels;