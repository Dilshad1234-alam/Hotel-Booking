import { useParams } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";

const RoomDetails = () => {
  const { id } = useParams();

  return (
    <AdminLayout title="Room Details">
      <div className="bg-[#18181b] p-8 rounded-3xl">
        <h2 className="text-3xl text-[#d4af37]">
          Room ID: {id}
        </h2>
      </div>
    </AdminLayout>
  );
};

export default RoomDetails;