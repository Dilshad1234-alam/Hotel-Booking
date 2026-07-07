import hotelModel from "../../models/admin/hotel.model.js";
import roomModel from "../../models/admin/room.model.js";
import bookingModel from "../../models/admin/booking.model.js";
import reviewModel from "../../models/admin/review.model.js";

export const getUserHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.find({ status: "active" });

    res.status(200).json({
      success: true,
      hotels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserHotelById = async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const rooms = await roomModel.find({
      hotel: req.params.id,
      status: "available",
    });

    res.status(200).json({
      success: true,
      hotel,
      rooms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUserBooking = async (req, res) => {
  try {
    const booking = await bookingModel.create({
      user: req.user._id,
      hotel: req.body.hotel || req.body.hotelId,
      room: req.body.room || req.body.roomId,
      checkIn: req.body.checkIn || req.body.checkInDate,
      checkOut: req.body.checkOut || req.body.checkOutDate,
      guests: req.body.guests,
      totalPrice: req.body.totalPrice,
      paymentStatus: "paid",
      status: "approved",

      timeline: [
        {
          title: "Booking Created",
          status: "pending",
          note: "Your booking request has been created.",
          date: new Date(),
        },
        {
          title: "Payment Completed",
          status: "paid",
          note: "Payment completed successfully via Razorpay.",
          date: new Date(),
        },
        {
          title: "Booking Approved",
          status: "approved",
          note: "Your booking has been approved automatically.",
          date: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log("CREATE USER BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ user: req.user._id })
      .populate("hotel", "name city location images")
      .populate("room", "roomType pricePerNight");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await reviewModel.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const smartHotelMatch = async (req, res) => {
  try {
    const { budget, city, tripType, hotelType, amenities = [] } = req.body;

    const userBudget = Number(budget) || 0;

    const hotels = await hotelModel.find({
      status: "active",
      city: { $regex: city || "", $options: "i" },
    });

    const results = [];

    for (const hotel of hotels) {
      const rooms = await roomModel.find({
        hotel: hotel._id,
        status: "available",
      });

      if (rooms.length === 0) continue;

      let score = 0;
      const reasons = [];

      const sortedRooms = rooms.sort(
        (a, b) => a.pricePerNight - b.pricePerNight
      );

      const bestRoom =
        sortedRooms.find((room) => room.pricePerNight <= userBudget) ||
        sortedRooms[0];

      if (hotel.city?.toLowerCase() === city?.toLowerCase()) {
        score += 25;
        reasons.push("City matches your search");
      }

      if (bestRoom.pricePerNight <= userBudget) {
        score += 25;
        reasons.push("Room fits your budget");
      } else {
        reasons.push(
          `Closest room is ₹${bestRoom.pricePerNight}, above your budget`
        );
      }

      const hotelAmenities = [
        ...(hotel.amenities || []),
        ...(bestRoom.amenities || []),
      ].map((a) => a.toLowerCase());

      const matchedAmenities = amenities.filter((item) =>
        hotelAmenities.some((a) => a.includes(item.toLowerCase()))
      );

      score += matchedAmenities.length * 10;

      if (matchedAmenities.length > 0) {
        reasons.push(`Matched amenities: ${matchedAmenities.join(", ")}`);
      }

      if (tripType === "Family" && bestRoom.capacity >= 3) {
        score += 15;
        reasons.push("Good for family stay");
      }

      if (tripType === "Couple" && bestRoom.capacity >= 2) {
        score += 15;
        reasons.push("Good for couples");
      }

      if (tripType === "Solo" && bestRoom.capacity >= 1) {
        score += 10;
        reasons.push("Good for solo travel");
      }

      if (hotelType === "Luxury") {
        if (Number(hotel.rating) >= 4) {
          score += 15;
          reasons.push("Luxury rated hotel");
        } else {
          score += 5;
          reasons.push("Premium stay option based on available room");
        }
      }

      if (hotelType === "Budget" && bestRoom.pricePerNight <= userBudget) {
        score += 15;
        reasons.push("Budget friendly option");
      }

      if (
        hotelType === "Business" &&
        hotelAmenities.some((a) =>
          ["wifi", "parking", "conference"].some((b) => a.includes(b))
        )
      ) {
        score += 15;
        reasons.push("Business friendly amenities");
      }

      results.push({
        hotel,
        bestRoom,
        score,
        matchPercentage: Math.min(score, 100),
        reasons,
      });
    }

    results.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      matches: results,
    });
  } catch (error) {
    console.log("AI match error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

