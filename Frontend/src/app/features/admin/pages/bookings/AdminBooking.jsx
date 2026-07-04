import AdminLayout from "../../components/layout/AdminLayout";
import BookingsTable from "../../components/bookings/BookingsTables";

const AdminBookings = () => {
  return (
    <AdminLayout title="Bookings">
      <BookingsTable />
    </AdminLayout>
  );
};

export default AdminBookings;