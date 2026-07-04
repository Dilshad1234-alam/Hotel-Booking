import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "deleted"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel;