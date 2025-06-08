import { Router } from "express";
import { registerUser } from "../controlers/user.controller.js";

const router = Router();

// Route to register a new user
router.route("/register").post(registerUser);



export default router;
