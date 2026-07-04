import { imagekit } from "../../config/imageKit.js";

export const uploadImage = async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const response = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/bookmystay/hotels",
    });

    return res.status(200).json({
      success: true,
      url: response.url,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};