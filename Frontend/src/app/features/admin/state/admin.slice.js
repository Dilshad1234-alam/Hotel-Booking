import { createSlice } from "@reduxjs/toolkit";


const adminSlice = createSlice({
    name: "admin",
    initialState: {
        dashboard: null,
        hotels: [],
        rooms: [],
        bookings: [],
        users: [],
        payments: [],
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        setDashboard: (state, action) => {
            state.dashboard = action.payload
        },

        // Hotels
        setHotels: (state, action) => {
          state.hotels = action.payload;
        },

        // Rooms
        setRooms: (state, action) => {
          state.rooms = action.payload;
        },

        // Bookings
        setBookings: (state, action) => {
          state.bookings = action.payload;
        },

        // Users
        setUsers: (state, action) => {
        state.users = action.payload;
        },

        // Payments
        setPayments: (state, action) => {
        state.payments = action.payload;
        },

        // Reviews
        setReviews: (state, action) => {
        state.reviews = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload
        },

        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setDashboard, setHotels, setRooms, setBookings, setUsers, setPayments, setReviews, setLoading, setError } = adminSlice.actions
export default adminSlice.reducer;