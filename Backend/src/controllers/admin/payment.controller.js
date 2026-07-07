import paymentModel from "../../models/admin/payment.model.js";
import { razorpay } from "../../config/razorpay.js"
import crypto from "crypto"

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


export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `bookmystay_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


