import bookingModel from "../models/booking.model.js";


export const createBooking = async (req, res) => {
  try {
    const booking = await bookingModel.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel
            .find()
            .populate("user", "fullname email contact")
            .populate("hotel", "name city")
            .populate("room", "roomType pricePerNight");

        return res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await bookingModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking status updated",
            booking,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};