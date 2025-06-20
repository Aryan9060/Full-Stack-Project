import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller for getting all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId || videoId == ":videoId") {
      throw new ApiError(400, "Video ID is required");
    }

    const pageNo = parseInt(page);
    const limits = parseInt(limit);
    const startIndex = (pageNo - 1) * limits;

    const comments = await Comment.aggregate([
      { $match: { video: ObjectId("684ebfe3d89a1fd4ac4aada2") } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limits,
      },
    ]);

    if (!comments) {
      throw new ApiError(404, "No comments found for this video");
    }

    res
      .status(200)
      .json(new ApiResponse(200, comments, "Fetched comments successfully"));
  } catch (error) {
    throw new ApiError(error.starusCode || 500, error.message);
  }
});

// Controller for adding a comment to a video
const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  try {
    const { videoId } = req.params;
    const { comment } = req.body;
    console.log("comment:", videoId);

    if (!videoId || videoId == ":videoID") {
      throw new ApiError(400, "Video ID is required");
    }

    if (!comment || !comment.trim()) {
      throw new ApiError(400, "Comment cannot be empty");
    }

    const newComment = await Comment.create({
      comment,
      owner: req.user._id,
      video: videoId,
    });

    if (!newComment) {
      throw new ApiError(400, "Failed to add comment");
    }

    res
      .status(201)
      .json(new ApiResponse(201, newComment, "Comment added successfully"));
  } catch (error) {
    throw new ApiError(error.starusCode || 500, error.message);
  }
});

// Controller for updating a comment
const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { comment } = req.body;

  try {
    if (!commentId || commentId == ":commentId") {
      throw new ApiError(400, "Comment ID is required");
    }

    if (!comment || !comment.trim()) {
      throw new ApiError(400, "Comment cannot be empty");
    }

    const commentToUpdate = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { comment },
      { new: true }
    );

    if (!commentToUpdate) {
      throw new ApiError(404, "Comment not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, commentToUpdate, "Comment updated successfully")
      );
  } catch (error) {
    throw new ApiError(error.starusCode || 500, error.message);
  }
});

// Controller for deleting a comment
const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new ApiError(400, "Comment ID is required");
    }

    const commentToDelete = await Comment.findByIdAndDelete({ _id: commentId });

    if (!commentToDelete) {
      throw new ApiError(404, "Comment not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted successfully"));
  } catch (error) {
    throw new ApiError(error.starusCode || 500, error.message);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
