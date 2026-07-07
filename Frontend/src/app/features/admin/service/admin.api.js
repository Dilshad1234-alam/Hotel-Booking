import axios from 'axios'

const adminApi = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
})

//  Dashboard
export const getDashboard = async () => {
    const response = await adminApi.get("/admin/dashboard")
    return response.data
}


// Hotels
export const getHotels = async () => {
  const res = await adminApi.get("/hotels");
  return res.data;
};

export const getHotelById = async (id) => {
  const res = await adminApi.get(`/hotels/${id}`);
  return res.data;
};

export const createHotel = async (formData) => {
  const res = await adminApi.post("/hotels", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return res.data;
};

export const updateHotel = async (id, data) => {
  const res = await adminApi.put(`/hotels/${id}`, data);
  return res.data;
};

export const deleteHotel = async (id) => {
  const res = await adminApi.delete(`/hotels/${id}`);
  return res.data;
};


// Rooms
export const getRooms = async () => {
  const res = await adminApi.get("/rooms");
  return res.data;
};

export const getRoomById = async (id) => {
  const res = await adminApi.get(`/rooms/${id}`);
  return res.data;
};


export const createRoom = async (formData) => {
  const res = await adminApi.post("/rooms", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateRoom = async (id, data) => {
  const res = await adminApi.put(`/rooms/${id}`, data);
  return res.data;
};

export const deleteRoom = async (id) => {
  const res = await adminApi.delete(`/rooms/${id}`);
  return res.data;
};


// Bookings

export const createBooking = async (data) => {
  const res = await adminApi.post("/admin/bookings", data);
  return res.data;
};

export const getBookings = async () => {
  const res = await adminApi.get("/admin/bookings");
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await adminApi.patch(`/admin/bookings/${id}/status`, {
    status,
  });
  return res.data;
};


// Users
export const getUsers = async () => {
  const res = await adminApi.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await adminApi.delete(`/admin/users/${id}`);
  return res.data;
};


// Payments
export const getPayments = async () => {
  const res = await adminApi.get("/admin/payments");
  return res.data;
};


// Reviews
export const getReviews = async () => {
  const res = await adminApi.get("/admin/reviews");
  return res.data;
};


// export const uploadImage = async (file) => {
//   const formData = new FormData();

//   formData.append("image", file);

//   const res = await adminApi.post("/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return res.data;
// };