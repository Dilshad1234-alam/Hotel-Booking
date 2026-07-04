import userModel from "../../models/auth/user.model.js";
import hotelModel from "../../models/admin/hotel.model.js";
import roomModel from "../../models/admin/room.model.js";
import bookingModel from "../../models/admin/booking.model.js";
import paymentModel from "../../models/admin/payment.model.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const totalHotels = await hotelModel.countDocuments();
        const totalRooms = await roomModel.countDocuments();
        const totalUsers = await userModel.countDocuments({ role: "user" });
        const totalBookings = await bookingModel.countDocuments();
        const pendingBookings = await bookingModel.countDocuments({ status: "pending" });

        const revenueData = await paymentModel.aggregate([
            { $match: { status: "success" } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        return res.status(200).json({
            success: true,
            stats: {
                totalHotels,
                totalRooms,
                totalUsers,
                totalBookings,
                pendingBookings,
                totalRevenue,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { isBlocked } = req.body;

        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            { isBlocked },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "User status updated",
            user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};