import multer from "multer";
import fs from "fs";
import cloudinary from "../../others/cloudinary.js";

const upload = multer({ dest: "uploads/" });

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "fluffys_uploads",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    });
    fs.unlinkSync(filePath); 
    return result.secure_url;
  } catch (err) {
    fs.unlinkSync(filePath);
    throw err;
  }
};

export { upload, uploadToCloudinary };
