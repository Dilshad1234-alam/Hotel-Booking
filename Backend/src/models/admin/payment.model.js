import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        method: {
            type: String,
            default: "razorpay",
        },
        transactionId: {
            type: String,
        },
        status: {
            type: String,
            enum: ["success", "failed", "refunded"],
            default: "success",
        },
    },
    { timestamps: true }
);

const paymentModel = mongoose.model("payment", paymentSchema);
export default paymentModel;