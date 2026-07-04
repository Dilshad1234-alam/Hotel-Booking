import roomModel from "../../models/admin/room.model.js";
import hotelModel from "../../models/admin/hotel.model.js";

export const createRoom = async (req, res) => {
    try {
        const hotel = await hotelModel.findById(req.body.hotel);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        const room = await roomModel.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Room created successfully",
            room,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find().populate("hotel", "name city location");

        return res.status(200).json({
            success: true,
            rooms,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await roomModel
      .findById(req.params.id)
      .populate("hotel", "name city location");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
    try {
        const room = await roomModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Room updated successfully",
            room,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const room = await roomModel.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Room deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};