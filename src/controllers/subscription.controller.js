import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  try {
    const { channelId } = req.params;
    const user = req.user;
    console.log("Toggle subscription for channelId: ", channelId);

    if (!channelId || channelId == ":channelId") {
      throw new ApiError(400, "channelId is required");
    }

    const existingSubscription = await Subscription.findOne({
      channel: channelId,
      user: user._id,
    });

    if (!existingSubscription) {
      await Subscription.creste({
        channel: channelId,
        user: user._id,
      });
    } else {
      await Subscription.findByIdAndDelete(existingSubscription._id);
    }

    res.json(new ApiResponse(200, "Subscription toggled successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to toggle subscription"
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId || channelId == ":channelId") {
      throw new ApiError(400, "Channel ID is required");
    }

    const subscribers = await Subscription.aggregate([
      {
        channel: channelId,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        },
      },
      {
        $addFields: {
          user: {
            $first: "$user",
          },
        },
      },
      // {
      //   $project: {
      //     fullName: 1,
      //     username: 1,
      //     avatar: 1,
      //     coverImage: 1,
      //   },
      // },
    ]);

    if (!subscribers.length) {
      throw new ApiError(404, "No subscribers found for this channel");
    }

    res.json(
      new ApiResponse(200, subscribers, "Fetched subscribers successfully")
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to get subscribers"
    );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
    const { subscriberId } = req.params;
    console.log("subscriberId: ", subscriberId);
    if (!subscriberId || subscriberId == ":subscriberId") {
      throw new ApiError(400, "Subscriber ID is required");
    }

    const subscriptions = await Subscription.aggregate([
      {
        user: subscriberId,
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
          pipeline: {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        },
      },
      {
        $addFields: {
          channel: {
            $first: "$channel",
          },
        },
      },
    ]);

    if (!subscriptions.length) {
      throw new ApiError(404, "No subscriptions found for this subscriber");
    }
    res.json(
      new ApiResponse(
        200,
        subscriptions,
        "Fetched subscribed channels successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to get subscribed channels"
    );
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
