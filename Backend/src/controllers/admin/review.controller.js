import reviewModel from "../../models/admin/review.model.js";

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel
            .find()
            .populate("user", "fullname email")
            .populate("hotel", "name city");

        return res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const approveReview = async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Review approved",
            review,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndUpdate(
            req.params.id,
            { status: "deleted" },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Review deleted",
            review,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};