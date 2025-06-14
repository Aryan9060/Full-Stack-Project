import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controlers/user.controller.js";
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

export default router;
