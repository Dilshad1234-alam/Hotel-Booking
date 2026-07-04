import AdminLayout from "../../components/layout/AdminLayout";
import PaymentsTable from "../../components/payments/PaymentsTable";

const AdminPayments = () => {
  return (
    <AdminLayout title="Payments">
      <PaymentsTable />
    </AdminLayout>
  );
};

export default AdminPayments;