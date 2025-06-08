import mongoose from "mongoose"
import { DB_NAME } from "../constenets.js"

const connectDB = async () => {
  try {
    const connectionInstence = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    )
    console.log(
      `\n MongoDB connected !! DBHOST: ${connectionInstence.connection.host}`
    )
  } catch (error) {
    console.log("Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

export default connectDB
