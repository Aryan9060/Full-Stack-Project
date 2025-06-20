import { ApiError } from "./ApiError.js";
import { v2 as cloudinary } from "cloudinary";

const deleteOnCloudinary = async (url, option) => {
  try {
    if (!url || !option) {
      throw new ApiError(
        400,
        `${!url ? "URL" : !option ? "Option" : ""} is required!!`
      );
    }

    url = url.split("/")[url.split("/").length - 1].split(".")[0];
    console.log("Public Id :-", url);

    const res = await cloudinary.uploader.destroy(url, option);
    console.log("Delete file from cloudinary || status :", res);

    return res;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new ApiError(500, "Error deleting file from Cloudinary");
  }
};

export default deleteOnCloudinary;
