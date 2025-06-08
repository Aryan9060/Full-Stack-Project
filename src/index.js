// require("dotenv").config({ path: "./env" })
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({path:'./.env'})

connectDB()

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
