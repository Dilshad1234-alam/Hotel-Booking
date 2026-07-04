import AdminLayout from "../../components/layout/AdminLayout";
import RoomsTable from "../../components/rooms/RoomsTables";

const AdminRooms = () => {
  return (
    <AdminLayout title="Rooms">
      <RoomsTable />
    </AdminLayout>
  );
};

export default AdminRooms;