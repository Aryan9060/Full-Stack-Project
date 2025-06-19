import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  try {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }

    const toggleVideoLike = await Like.findOneAndUpdate(
      { video: videoId, likeBy: req.user._id },
      { $set: { isLiked: !req.user.isLiked } },
      { new: true }
    ).populate("user", "username");

    if (!toggleVideoLike) {
      throw new ApiError(400, "Failed to toggle like");
    }

    res
      .status(200)
      .json(new ApiResponse(200, toggleVideoLike, "Like toggled successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to toggle like"
    );
  }
});

// Toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment

  try {
    const { commentId } = req.params;

    if (!commentId || !isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment ID");
    }

    const toggleCommentLike = await Like.findOneAndUpdate(
      { comment: commentId, likeBy: req.user._id },
      { $set: { isLiked: !req.user.isLiked } },
      { new: true }
    ).populate("user", "username");

    if (!toggleCommentLike) {
      throw new ApiError(400, "Failed to toggle like");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, toggleCommentLike, "Like toggled successfully")
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to toggle like"
    );
  }
});

// Toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet
  try {
    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweet ID");
    }
    const toggleTweetLike = await Like.findOneAndUpdate(
      { tweet: tweetId, likeBy: req.user._id },
      { $set: { isLiked: !req.user.isLiked } },
      { new: true }
    ).populate("user", "username");

    if (!toggleTweetLike) {
      throw new ApiError(400, "Failed to toggle like");
    }

    res
      .status(200)
      .json(new ApiResponse(200, toggleTweetLike, "Like toggled successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to toggle like"
    );
  }
});

// Get all liked videos by user
const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  try {
    const likedVideos = await Like.find({ likeBy: req.user._id, isLiked: true })
      .populate("video", "title description")
      .exec();

    res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to fetch liked videos");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
