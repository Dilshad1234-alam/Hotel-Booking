import hotelModel from "../models/hotel.model.js";

export const createHotel = async (req, res) => {
    try {
        const hotel = await hotelModel.create({
            ...req.body,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            hotel,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllHotels = async (req, res) => {
    try {
        const hotels = await hotelModel.find().populate("createdBy", "fullname email role");

        return res.status(200).json({
            success: true,
            hotels,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getHotelById = async (req, res) => {
    try {
        const hotel = await hotelModel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        return res.status(200).json({
            success: true,
            hotel,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const hotel = await hotelModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            hotel,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const hotel = await hotelModel.findByIdAndDelete(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};