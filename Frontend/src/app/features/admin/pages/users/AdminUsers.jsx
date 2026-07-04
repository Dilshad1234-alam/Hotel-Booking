import AdminLayout from "../../components/layout/AdminLayout";
import UsersTable from "../../components/users/UsersTable";

const AdminUsers = () => {
  return (
    <AdminLayout title="Users">
      <UsersTable />
    </AdminLayout>
  );
};

export default AdminUsers;