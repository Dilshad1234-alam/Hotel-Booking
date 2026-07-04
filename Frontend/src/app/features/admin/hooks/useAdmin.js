import { useDispatch } from 'react-redux'
import { getDashboard, getHotels, getBookings, getPayments, getReviews, getRooms, getUsers } from '../service/admin.api.js'
import { setDashboard, setLoading, setError, setBookings, setHotels, setPayments, setReviews, setRooms, setUsers } from '../state/admin.slice.js'
import { useCallback } from 'react'


export const useAdmin = () => {
    const dispatch = useDispatch()

    const handleGetDashboard = useCallback(async () => {
        try {
            dispatch(setLoading(true))
            const data = await getDashboard()
            dispatch(setDashboard(data.stats))

            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])
    

    // Hotel
    const handleGetHotels = useCallback(async () => {
      const data = await getHotels();
      dispatch(setHotels(data.hotels || []));
      return data;
    }, [dispatch]);


    // Room
    const handleGetRooms = useCallback(async () => {
      const data = await getRooms();
      dispatch(setRooms(data.rooms || []));
      return data;
    }, [dispatch]);


    // Booking
    const handleGetBookings = useCallback(async () => {
      const data = await getBookings();
      dispatch(setBookings(data.bookings || []));
      return data;
    }, [dispatch]);


    // User
    const handleGetUsers = useCallback(async () => {
      const data = await getUsers();
      dispatch(setUsers(data.users || []));
      return data;
    }, [dispatch]);


    // Payment
    const handleGetPayments = useCallback(async () => {
      const data = await getPayments();
      dispatch(setPayments(data.payments || []));
      return data;
    }, [dispatch]);


    // Review
    const handleGetReviews = useCallback(async () => {
      const data = await getReviews();
      dispatch(setReviews(data.reviews || []));
      return data;
    }, [dispatch]);

    return { handleGetDashboard, handleGetHotels, handleGetRooms, handleGetBookings, handleGetUsers, handleGetPayments, handleGetReviews }
}