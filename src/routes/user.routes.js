import { Router } from "express";
import { registerUser } from "../controlers/user.controller.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// Route to register a new user
router.route("/register").post(
  upload.fields(
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    }
  ),
  registerUser
);

export default router;
