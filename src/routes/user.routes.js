import { Router } from "express";
import {
  chengeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
} from "../controlers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middlewate.js";

const router = Router();

// Route to register a new user
router.route("/register").post(
  upload.fields([
    {
      name: "avater",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").put(verifyJWT, chengeCurrentPassword); //post
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").put(verifyJWT, updateAccountDetails); //patch
router
  .route("/upload-avatar")
  .put(verifyJWT, upload.single("avater"), updateAccountDetails); //patch
router
  .route("/upload-cover-image")
  .put(verifyJWT, upload.single("coverImage"), updateAccountDetails);
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
router.route("/histery").get(verifyJWT, getWatchHistory);

export default router;
