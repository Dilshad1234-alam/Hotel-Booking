import { createBrowserRouter } from "react-router-dom";

import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";

// Dashboard
import AdminDashboard from "./features/admin/pages/dashboard/AdminDashboard";

// Hotels
import AdminHotels from "./features/admin/pages/hotels/AdminHotels";
import AddHotel from "./features/admin/pages/hotels/AddHotel";

// Rooms
import AdminRooms from "./features/admin/pages/rooms/AdminRooms";

// Bookings
import AdminBookings from "./features/admin/pages/bookings/AdminBooking";

// Payments
import AdminPayments from "./features/admin/pages/payments/AdminPayments";

// Reviews
import AdminReviews from "./features/admin/pages/reviews/AdminReviews";

// Users
import AdminUsers from "./features/admin/pages/users/AdminUsers";
import HotelDetails from "./features/admin/pages/hotels/HotelDetails";
import EditHotel from "./features/admin/pages/hotels/EditHotels";
import AddRoom from "./features/admin/pages/rooms/AddRoom";
import RoomDetails from "./features/admin/pages/rooms/RoomDetails";
import EditRoom from "./features/admin/pages/rooms/EditRoom";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  // =====================
  // ADMIN ROUTES
  // =====================

  {
    path: "/admin/dashboard",
    element: (
      <Protected role="admin">
        <AdminDashboard />
      </Protected>
    ),
  },

  // Hotels
  {
    path: "/admin/hotels",
    element: (
      <Protected role="admin">
        <AdminHotels />
      </Protected>
    ),
  },

  {
    path: "/admin/hotels/create",
    element: (
      <Protected role="admin">
        <AddHotel />
      </Protected>
    ),
  },

  {
    path: "/admin/hotels/:id",
    element: (
    <Protected role="admin">
        <HotelDetails />
    </Protected>
    ),
  },
  {
    path: "/admin/hotels/edit/:id",
    element: (
      <Protected role="admin">
          <EditHotel />
      </Protected>
    ),
  },


  // Rooms
  {
    path: "/admin/rooms",
    element: (
      <Protected role="admin">
        <AdminRooms />
      </Protected>
    ),
  },
  {
    path: "/admin/rooms/create",
    element: (
      <Protected role="admin">
      <AddRoom />
      </Protected>
    ),
  },
  {
    path: "/admin/rooms/:id",
    element: (
      <Protected role="admin">
        <RoomDetails/>
      </Protected>
    ),
  },
  {
    path: "/admin/rooms/edit/:id",
    element: (
      <Protected role="admin">
        <EditRoom />
      </Protected>
    ),
  },

  // Bookings
  {
    path: "/admin/bookings",
    element: (
      <Protected role="admin">
        <AdminBookings />
      </Protected>
    ),
  },

  // Payments
  {
    path: "/admin/payments",
    element: (
      <Protected role="admin">
        <AdminPayments />
      </Protected>
    ),
  },

  // Reviews
  {
    path: "/admin/reviews",
    element: (
      <Protected role="admin">
        <AdminReviews />
      </Protected>
    ),
  },

  // Users
  {
    path: "/admin/users",
    element: (
      <Protected role="admin">
        <AdminUsers />
      </Protected>
    ),
  },
]);