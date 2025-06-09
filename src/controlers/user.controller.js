import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user data from front-end request
  //validation of user data here
  //check if user already exists
  //check for image and avater
  //upload image to cloudinary and save url in db
  //create user object  - create entry in db
  //remove jwt token refresh token and password from user object - remove sensitive data
  //chech for user cration success
  //return responce with user data

  // validation and data extraction
  const { fullName, email, password, username } = req.body;

  console.log("Reruest from body :-", req.body);
  console.log("Reruest from file :-", req.files);

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
  const avatarLoacalPath = req.files?.avater[0]?.path;
  let coverImageLocalPath
if(req.files&& Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
  coverImageLocalPath = req.files.coverImage[0].path;
}


  if (!avatarLoacalPath) {
    throw new ApiError(400, "Avater file is required");
  }

  const avatar = await uploadCloudinary(avatarLoacalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

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

export { registerUser };
