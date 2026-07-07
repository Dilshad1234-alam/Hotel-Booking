import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hotel",
            required: true,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "room",
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "checked_in", "cancelled", "completed"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        timeline: [
          {
            title: String,
            status: String,
            date: {
              type: Date,
              default: Date.now,
            },
            note: String,
          },
        ]

    },
    { timestamps: true }
);

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;