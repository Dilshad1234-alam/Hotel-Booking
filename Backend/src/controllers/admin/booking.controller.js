import bookingModel from "../../models/admin/booking.model.js";
import paymentModel from "../../models/admin/payment.model.js";


export const createBooking = async (req, res) => {
  try {
    const booking = await bookingModel.create({
      user: req.user._id,
      hotel: req.body.hotel || req.body.hotelId,
      room: req.body.room || req.body.roomId,
      checkIn: req.body.checkIn || req.body.checkInDate,
      checkOut: req.body.checkOut || req.body.checkOutDate,
      guests: req.body.guests,
      totalPrice: req.body.totalPrice,
      paymentStatus: req.body.paymentStatus || "pending",


      timeline: [
        {
          title: "Booking Created",
          status: "pending",
          note: "Your booking request has been created.",
          date: new Date(),
        },
      ],
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

    const allowedStatus = ["pending", "approved", "cancelled", "completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const timelineMap = {
      approved: {
        title: "Booking Approved",
        note: "Admin approved your booking.",
      },
      checked_in: {
        title: "Checked In",
        note: "Guest has checked in successfully.",
      },
      completed: {
        title: "Stay Completed",
        note: "Your stay has been completed.",
      },
      cancelled: {
        title: "Booking Cancelled",
        note: "Your booking was cancelled.",
      },
    };

    const booking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          timeline: {
            title: timelineMap[status].title,
            status,
            note: timelineMap[status].note,
            date: new Date(),
          },
        },
      },
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



