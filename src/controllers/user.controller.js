import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken";
import deleteOnCloudinary from "../utils/deleteOnCloudinary.js";

const options = { httpOnly: true, secure: true };

// Generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

//user Registration
const registerUser = asyncHandler(async (req, res) => {
  // validation and data extraction
  const { fullName, email, password, username } = req.body;

  console.log("Request from body :-", req.body);
  console.log("Request from file :-", req.files);

  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(408, "User already exists");
  }

  // upload images to cloudinary and save url in db
  const avatarLoacalPath = req.files?.avatar[0].path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLoacalPath) {
    throw new ApiError(400, "Avater file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLoacalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avater file is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
  });
  console.log("user register :-", user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

//user Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(401, "user not found");
  }

  const isPasswordValidate = await user.isPasswordCurrect(password);

  if (!isPasswordValidate) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

//user Logout
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "user logged out successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to logout user");
  }
});

//refreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const IncommingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!IncommingRefreshToken) {
      throw new ApiError(401, "Unauthorized token");
    }

    const decodedToken = JWT.verify(
      IncommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (IncommingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to refresh access token");
  }
});

//change current password
const chengeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    console.log("old password :-", oldPassword, "new password :-", newPassword);

    if (!user) {
      throw new ApiError(401, "Unauthorized user");
    }

    const isPasswordValidate = await user.isPasswordCurrect(oldPassword);

    if (!isPasswordValidate) {
      throw new ApiError(401, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to change password");
  }
});

//get Current user
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized user");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Fetched user successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to get user details");
  }
});

//upsate account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      throw new ApiError(401, "all fields are required");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          email: email.toLowerCase(),
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          "Account details updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed to update account details"
    );
  }
});

//upload Avatar
const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const avatarLoacalPath = req.file?.path;

    if (!avatarLoacalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    const deleteCoverImage = await deleteOnCloudinary(req.user.coverImage, {
      resourse_type: "image",
    });

    if (!deleteCoverImage) {
      throw new ApiError(500, "Failed to delete coverImage from cloudinary");
    }

    const avatar = await uploadOnCloudinary(avatarLoacalPath);

    if (!avatar) {
      throw new ApiError(500, "Failed to upload avatar to cloudinary");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: avatar.secure_url },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to update avatar");
  }
});

//upload coverImage
const updateCoverImage = asyncHandler(async (req, res) => {
  try {
    const coverImageLoacalPath = req.file?.path;

    if (!coverImageLoacalPath) {
      throw new ApiError(400, "CoverImage file is required");
    }

    const deleteCoverImage = await deleteOnCloudinary(req.user.coverImage, {
      resourse_type: "image",
    });

    if (!deleteCoverImage) {
      throw new ApiError(500, "Failed to delete coverImage from cloudinary");
    }
    const coverImage = await uploadOnCloudinary(coverImageLoacalPath);

    if (!coverImage) {
      throw new ApiError(500, "Failed to upload coverImage to cloudinary");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { coverImage: coverImage.secure_url },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "CoverImage updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to update coverImage");
  }
});

//get user channel profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new ApiError(400, "Username is required");
    }

    const chennal = await User.aggregate([
      { $match: { username: username?.toLowerCase() } },
      {
        $lookup: {
          from: "subscribers",
          localField: "_id",
          foreignField: "subscriber",
          as: "Subscriber",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "SubscribedTo",
        },
      },
      {
        $addFields: {
          subscriberCount: {
            $size: "$Subscriber",
          },
          subscribedToCount: {
            $size: "$SubscribedTo",
          },
          isSubscriber: {
            $cond: {
              if: { $in: [req.user?._id, "$Subscriber.subscriber"] },
              then: true,
              else: false,
            },
          },
          isSubscribedTo: { $in: [req.user?._id, "$SubscribedTo.channel"] },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          fullName: 1,
          subscriberCount: 1,
          subscribedToCount: 1,
          isSubscriber: 1,
          isSubscribedTo: 1,
        },
      },
    ]);

    if (!chennal?.length) {
      throw new ApiError(404, "Chaannal does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          chennal[0],
          "Fetched user channel profile successfully"
        )
      );
  } catch (error) {}
});

//get watch history
const getWatchHistory = asyncHandler(async (req, res) => {
  try {
    const user = User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
        },
        pipeline: [
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
                $firet: "$owner",
              },
            },
          },
        ],
      },
    ]);

    if (!user?.length) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user[0].watchHistory,
          "Fetched watch history successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to get watch history");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  chengeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
