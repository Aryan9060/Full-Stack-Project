import { model, Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

// Add any additional methods or hooks here

export const Playlist = model("Playlist", playlistSchema);
