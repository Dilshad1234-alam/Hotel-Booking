import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hotel",
            required: true,
        },
        roomType: {
            type: String,
            required: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
        },
        totalRooms: {
            type: Number,
            required: true,
        },
        availableRooms: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        images: [
            {
                url: String,
            },
        ],
        amenities: [
            {
                type: String,
            },
        ],
        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available",
        },
    },
    { timestamps: true }
);

const roomModel = mongoose.model("room", roomSchema);
export default roomModel;