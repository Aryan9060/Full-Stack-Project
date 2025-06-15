import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import deleteOnCloudinary from "../utils/deleteOnCloudinary.js";

//Get all videos in a paginated manner
const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const videos = await Video.find({
      owner: userId,
    })
      .sort({
        [sortBy]: sortType === "asc" ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!videos) {
      throw new ApiError(404, "No videos found!");
    }
    res
      .status(200)
      .json(new ApiResponse(200, videos, "Fetched videos successfully"));

    //TODO: get all videos based on query, sort, pagination
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//publish a video
const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video

  try {
    const { title, description } = req.body;
    const user = req.user;

    console.log("user:", user);

    if (!title || !description) {
      throw new ApiError(
        400,
        `${!title ? "Title" : !description ? "Description" : ""} is required!!`
      );
    }

    let videopath;
    let thumbnailpath;
    if (
      req.files &&
      Array.isArray(req.files.videoFile) &&
      req.files.videoFile.length > 0
    ) {
      videopath = req.files.videoFile[0].path;
    }

    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailpath = req.files.thumbnail[0].path;
    }

    if (!videopath || !thumbnailpath) {
      throw new ApiError(
        400,
        `${!videopath ? "Video" : !thumbnailpath ? "Thumbnail" : ""} is required!!`
      );
    }

    const videoFile = await uploadOnCloudinary(videopath);
    const thumbnail = await uploadOnCloudinary(thumbnailpath);

    if (!videoFile || !thumbnail) {
      throw new ApiError(
        500,
        `Failed to upload ${videoFile ? "videoFile" : thumbnail ? "thumbnail" : ""} to cloudinary`
      );
    }

    const newVideo = await Video.create({
      title,
      description,
      videoFile: videoFile.secure_url,
      thumbnail: thumbnail.secure_url,
      duration: videoFile.duration,
      owner: user,
      published: false,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newVideo, "Video published successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to publish video");
  }
});

//Get a single video by its ID
const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id

  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Fetched video successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to get video");
  }
});

//Update a video by its ID
const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail

  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailpath = req.file?.path;

    if (!title || !description || !videoId || !thumbnailpath) {
      throw new ApiError(
        400,
        `${!title ? "Title" : !description ? "Description" : !videoId ? "Video ID" : !thumbnailpath ? "Thumbnail" : ""} is required!!`
      );
    }

    const video = await Video.findById(videoId);
    const thumbnail = await uploadOnCloudinary(thumbnailpath);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    const deleteThumbnail = await deleteOnCloudinary(video.thumbnail, {
      resource_type: "image",
      type: "upload",
    });

    if (!deleteThumbnail) {
      throw new ApiError(500, "Failed to delete old thumbnail");
    }

    if (!thumbnail) {
      throw new ApiError(500, "Failed to upload thumbnail to cloudinary");
    }

    const newVideo = await Video.findByIdAndUpdate(
      { _id: videoId },
      {
        title,
        description,
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, newVideo, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Failed to update video"
    );
  }
});

//Delete a video by its ID
const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video

  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Invalid video ID");
    }

    const deleteVideo = await deleteOnCloudinary(video.videoFile, {
      resource_type: "video",
      type: "upload",
    });
    const deleteThumbnail = await deleteOnCloudinary(video.thumbnail, {
      resource_type: "image",
      type: "upload",
    });

    if (!deleteVideo || !deleteThumbnail) {
      throw new ApiError(500, "Failed to delete video from cloudinary");
    }

    // await video.remove();
    await Video.findByIdAndDelete(videoId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Failed to delete video"
    );
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: { isPublish: !video.isPublish } },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedVideo, "Video status updated successfully")
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Failed to update video status"
    );
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
