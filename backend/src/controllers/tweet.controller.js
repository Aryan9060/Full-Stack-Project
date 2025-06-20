import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Controller for creating a new tweet
const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  try {
    const { userId, content } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      throw new ApiError("Invalid user ID", 400);
    }

    if (!content || content.trim().length === 0) {
      throw new ApiError("Content cannot be empty", 400);
    }

    const tweets = await Tweet.create({ owner: userId, content });

    if (!tweets) {
      throw new ApiError("Failed to create tweet", 500);
    }

    res
      .status(201)
      .json(new ApiResponse(201, tweets, "Tweet created successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to create tweet"
    );
  }
});

//Controller for getting all tweets
const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  try {
    const { userId } = req.params;
    if (!userId || !isValidObjectId(userId)) {
      throw new ApiError("Invalid user ID", 400);
    }
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    if (!tweets) {
      throw new ApiError("No tweets found for this user", 404);
    }

    res.json(new ApiResponse(200, tweets, "Tweets retrieved successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to retrieve tweets"
    );
  }
});

//Controller for updating a tweet
const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  try {
    const { tweetId } = req.params;
    const { content } = req.body;
    if (!tweetId || !isValidObjectId(tweetId)) {
      throw new ApiError("Invalid tweet ID", 400);
    }
    if (!content || content.trim().length === 0) {
      throw new ApiError("Content cannot be empty", 400);
    }
    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content },
      { new: true }
    );

    if (!tweet) {
      throw new ApiError("Failed to update tweet", 500);
    }

    res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to update tweet"
    );
  }
});

// Controller for deleting a tweet
const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  try {
    const { tweetId } = req.params;
    if (!tweetId || !isValidObjectId(tweetId)) {
      throw new ApiError("Invalid tweet ID", 400);
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
      throw new ApiError("Failed to delete tweet", 500);
    }

    res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to delete tweet"
    );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
