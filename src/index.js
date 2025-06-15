// require("dotenv").config({ path: "./env" })
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Database connection faild !!", error);
    });
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
/*
import mongoose from "mongoose"
import { DB_NAME } from "./constenets"
import express from "express"
const app = express()
// Connect to MongoDB
;(async () => {
  try {
    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("connected", () => console.log("Connected to MongoDB"))
    app.off("error", (error) =>
      console.error("Error connecting to MongoDB:", error)
    )
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  } catch (error) {
    console.log("Error occurred:- ", error)
    throw error
  }
})()
*/
