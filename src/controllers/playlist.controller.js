import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist

  try {
    const { name } = req.body;
    const user = req.user;
    const description = req.body?.description || "";
    console.log("Creating new playlist: ", req.body);

    if (!name) {
      throw new ApiError("Name is required");
    }

    const playlist = await Playlist.create({
      name,
      description,
      owner: user._id,
    });
    if (!playlist) {
      throw new ApiError("Failed to create playlist");
    }
    res
      .status(201)
      .json(new ApiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to create playlist"
    );
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists

  try {
    const { userId } = req.params;

    if (!userId || userId == ":userId") {
      throw new ApiError(400, "User ID is required");
    }

    const playlists = await Playlist.find({ owner: userId });

    if (!playlists || playlists.length === 0) {
      throw new ApiError(404, "User does not have any playlists");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, playlists, "Fetched user's playlists successfully")
      );
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to get user's playlists"
    );
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id

  try {
    const { playlistId } = req.params;

    if (!playlistId || playlistId == ":playlistId") {
      throw new ApiError(400, "Playlist ID is required");
    }

    const playlist = await Playlist.aggregat([
      {
        $match: { _id: mongoose.Types.ObjectId(playlistId) },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
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
          ],
        },
      },
    ]);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Fetched playlist successfully"));
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to get playlist"
    );
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId || playlistId == ":playlistId") {
      throw new ApiError(400, "Playlist ID is required");
    }
    if (!videoId || videoId == ":videoId") {
      throw new ApiError(400, "Video ID is required");
    }

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { videos: videoId } },
      { new: true }
    );

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to add video to playlist"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId || playlistId == ":playlistId") {
      throw new ApiError(400, "Playlist ID is required");
    }
    if (!videoId || videoId == ":videoId") {
      throw new ApiError(400, "Video ID is required");
    }

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { videos: videoId } },
      { new: true }
    );

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to remove video from playlist"
    );
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  try {
    const { playlistId } = req.params;

    if (!playlistId || playlistId == ":playlistId") {
      throw new ApiError(400, "Playlist ID is required");
    }

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to delete playlist"
    );
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId || playlistId == ":playlistId") {
      throw new ApiError(400, "Playlist ID is required");
    }

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }

    if (!name) {
      throw new ApiError(400, "Name is required");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { name, description },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new ApiError(404, "Playlist not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
      );
  } catch (error) {
    throw new ApiError(
      error?.statusCode,
      500,
      error?.message || "Failed to update playlist"
    );
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
