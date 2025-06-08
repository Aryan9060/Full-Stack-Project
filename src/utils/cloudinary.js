import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localpath) => {
  try {
    if (!localpath) return null;

    // Upload the file to Cloudinary
    const res = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });

    //file has been uploaded successfully
    console.log("This file has been uploaded to Cloudinary:", res.url);
    return res;
  } catch (error) {
    fs.unlinkSync(localpath);
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

export { uploadCloudinary };
