import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localpath) => {
  try {
    if (!localpath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });

    //Remove the local file after successful upload
    fs.unlinkSync(localpath);
    console.log("Response from cloudinary :-", response);

    return response;
  } catch (error) {
    // Delete the local file if an error occurs during upload

    console.error("Error uploading file to Cloudinary:", error);
    if (localpath) fs.unlinkSync(localpath);
    return null;
  }
};

export { uploadCloudinary };
