import AdminLayout from "../../components/layout/AdminLayout";
import ReviewsTable from "../../components/reviews/ReviewsTable";

const AdminReviews = () => {
  return (
    <AdminLayout title="Reviews">
      <ReviewsTable />
    </AdminLayout>
  );
};

export default AdminReviews;