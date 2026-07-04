import paymentModel from "../../models/admin/payment.model.js";

export const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentModel
            .find()
            .populate("user", "fullname email")
            .populate("booking");

        return res.status(200).json({
            success: true,
            payments,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const refundPayment = async (req, res) => {
    try {
        const payment = await paymentModel.findByIdAndUpdate(
            req.params.id,
            { status: "refunded" },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Payment refunded",
            payment,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};