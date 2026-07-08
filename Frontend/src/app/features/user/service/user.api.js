import axios from "axios";

const userApiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
  withCredentials: true,
});

export async function getUserHotels() {
  const response = await userApiInstance.get("/hotels");
  return response.data;
}

export async function getUserHotelById(id) {
  const response = await userApiInstance.get(`/hotels/${id}`);
  return response.data;
}

export async function createUserBooking(data) {
  const response = await userApiInstance.post("/bookings", data);
  return response.data;
}

export async function getMyBookings() {
  const response = await userApiInstance.get("/my-bookings");
  return response.data;
}

export async function createReview(data) {
  const response = await userApiInstance.post("/reviews", data);
  return response.data;
}

// Razorpay — create order on backend before opening checkout
export async function createRazorpayOrder(data) {
  const response = await userApiInstance.post("/payment/create-order", data);
  return response.data;
}

// Verify payment signature after checkout success
export async function verifyRazorpayPayment(data) {
  const response = await userApiInstance.post("/payment/verify", data);
  return response.data;
}


export const smartHotelMatch = async (data) => {
  const res = await userApiInstance.post("/ai-match", data);
  return res.data;
};


