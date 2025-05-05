import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { Block } from "../models/block.model.js";
import { Friend } from "../models/friend.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { SuccessResponse, ErrorResponse } from "../utils/responseHandler.js";
import { getUserSocketId, IO } from "../utils/socket.js";

// Routes for Block and Unblock Request Logic

export const getAllUser = async (req, res) => {
  const userId = req.userId;

  try {
    // Get all blocked user IDs
    const blockedUsers = await Block.find({ blockedBy: userId }).select(
      "blockedUser"
    );
    const blockedUserIds = blockedUsers.map((b) => b.blockedUser);

    // Fetch all users (excluding self + blocked)
    const friendRelations = await Friend.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .select("sender receiver status")
      .lean();

    const friendStatusMap = new Map();
    const acceptedFriendIds = new Set();

    for (const relation of friendRelations) {
      const isSender = relation.sender.toString() === userId.toString();
      const otherUserId = isSender
        ? relation.receiver.toString()
        : relation.sender.toString();

      if (relation.status === "accepted") {
        // ✅ Hide for both sender and receiver
        acceptedFriendIds.add(otherUserId);
      }

      if (relation.status === "pending") {
        // ✅ Show only to the sender
        if (isSender) {
          friendStatusMap.set(otherUserId, "pending");
        } else {
          // Receiver shouldn't see pending requests
          acceptedFriendIds.add(otherUserId);
        }
      }
    }

    // Build user list, excluding blocked, self, and friends
    const users = await User.find(
      {
        _id: {
          $ne: userId,
          $nin: [...blockedUserIds, ...acceptedFriendIds],
        },
        isBlocked: false,
        isDeleted: false,
      },
      {
        name: 1,
        email: 1,
        lastSeen: 1,
        isVerified: 1,
        bio: 1,
        profilePic: 1,
      }
    ).lean();

    // Enrich users with relationship status
    const enrichedUsers = users.map((user) => ({
      ...user,
      status: friendStatusMap.get(user._id.toString()) || "none",
    }));

    return SuccessResponse(res, 200, "you got all users", enrichedUsers);
  } catch (error) {
    console.log("Error in getAllUser", error);
    return ErrorResponse(res, 500, error.message);
  }
};

export const getFriendRequest = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(String(req.userId));

  try {
    const findFriendRequest = await Friend.find({
      receiver: userId,
      status: "pending",
    })
      .select("sender status")
      .populate("sender", "name email bio profilePic")
      .lean();

    return SuccessResponse(
      res,
      200,
      "you got all friend requests",
      findFriendRequest
    );
  } catch (error) {
    console.log("Error in getAllUser", error);
    return ErrorResponse(res, 500, error.message);
  }
};

export const blockUser = async (req, res) => {
  const { blockUserId } = req.body;
  const userId = req.userId;

  try {
    const findBlockUser = await Block.findOne({
      blockedUser: blockUserId,
      blockedBy: userId,
    });

    if (findBlockUser) {
      return ErrorResponse(res, 401, "User is Already blocked");
    }

    await Block.create({
      blockedUser: blockUserId,
      blockedBy: userId,
    });

    return SuccessResponse(res, 200, "User blocked successfully");
  } catch (error) {
    console.log("Error in login", error);
    return ErrorResponse(res, 500, error.message);
  }
};

export const unblockUser = async (req, res) => {
  const { blockUserId } = req.body;
  const userId = req.userId;

  try {
    const findBlockUser = await Block.findOne({
      blockedUser: blockUserId,
      blockedBy: userId,
    });

    if (!findBlockUser) {
      return ErrorResponse(res, 401, "User is Already unblocked");
    }

    await Block.findOneAndDelete({
      blockedUser: blockUserId,
      blockedBy: userId,
    });

    return SuccessResponse(res, 200, "User unblocked successfully");
  } catch (error) {
    console.log("Error in login", error);
    return ErrorResponse(res, 500, error.message);
  }
};

// Routes for Friend Request Logic

export const sendFriendRequests = async (req, res) => {
  const { userToBeSendRequest } = req.body;
  const userId = req.userId;

  try {
    const isAlreadyFriend = await Friend.findOne({
      sender: userId,
      receiver: userToBeSendRequest,
    });

    if (isAlreadyFriend?.status === "pending") {
      return ErrorResponse(res, 401, "Friend request already sended");
    }

    if (isAlreadyFriend?.status === "accepted") {
      return ErrorResponse(res, 401, "This user is already your friend");
    }

    const friendRequest = await Friend.create({
      sender: userId,
      receiver: userToBeSendRequest,
    });

    const findFriendRequest = await Friend.findOne({
      _id: friendRequest._id,
      status: "pending",
    })
      .select("sender status")
      .populate("sender", "name email bio profilePic")
      .lean();

    const receiverSocketId = getUserSocketId(userToBeSendRequest);
    if (receiverSocketId) {
      IO().to(receiverSocketId).emit("request", { findFriendRequest });
    }
    return SuccessResponse(res, 200, "Friend Request sended successfully");
  } catch (error) {
    console.log("Error in getAllUser", error);
    return ErrorResponse(res, 500, error.message);
  }
};

export const cancelFriendRequests = async (req, res) => {
  const { userToBeSendRequest } = req.body;
  const userId = req.userId;

  try {
    const isAlreadyFriend = await Friend.findOne({
      sender: userId,
      receiver: userToBeSendRequest,
    });

    if (!isAlreadyFriend) {
      return ErrorResponse(res, 401, "Friend request does'nt exist");
    }

    await Friend.findByIdAndDelete(isAlreadyFriend._id);

    return SuccessResponse(res, 200, "Friend Request Deleted successfully");
  } catch (error) {
    console.log("Error in getAllUser", error);
    return ErrorResponse(res, 500, error.message);
  }
};



export const acceptFriendRequest = async (req, res) => {

  const { userWhoSentRequest } = req.body;
  const userId = req.userId;

  console.log("userWhoSentRequest", userWhoSentRequest)
  console.log("userId", userId)


  try {
    const friendRequest = await Friend.findOne({
      sender: userWhoSentRequest,
      receiver: userId,
    });
    if (!friendRequest) {
      return ErrorResponse(res, 404, "Friend request not found");
    }

    if (friendRequest.status === "accepted") {
      return ErrorResponse(res, 400, "You are already friends");
    }

    if (friendRequest.sender.toString() === userId) {
      return ErrorResponse(
        res,
        403,
        "You cannot accept your own friend request"
      );
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    let conversation = await Conversation.findOne({
      isGroupchat: false,
      "participants.userId": { $all: [userWhoSentRequest, userId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          {
            userId: userWhoSentRequest,
          },
          {
            userId: userId,
          },
        ],
        isGroupchat: false,
      });
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants.userId", "name profilePic")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name profilePic",
        },
      });


    const receiverSocketId = getUserSocketId(userWhoSentRequest);
    const userSocketId = getUserSocketId(userId);
    
    if (receiverSocketId) {
      IO().to([userSocketId, receiverSocketId]).emit("friendRequestAccepted", { conversaion : populatedConversation, removePeopleId : userId });
    }

    return SuccessResponse(res, 200, "Friend request accepted successfully");
  } catch (error) {
    console.error("Error in acceptFriendRequest", error);
    return ErrorResponse(res, 500, "Internal server error");
  }
};

export const rejectFriendRequest = async (req, res) => {
  const { userFromRequestSend } = req.body;
  const userId = req.userId;

  try {
    const friendRequest = await Friend.findOne({
      sender: userFromRequestSend,
      receiver: userId,
    });

    if (!friendRequest) {
      return ErrorResponse(res, 404, "Friend request not found");
    }

    if (friendRequest.status === "accepted") {
      return ErrorResponse(res, 400, "You are already friends");
    }

    if (friendRequest.sender.toString() === userId) {
      return ErrorResponse(
        res,
        403,
        "You cannot reject your own friend request"
      );
    }

    // Delete the friend request
    await Friend.deleteOne({
      sender: userFromRequestSend,
      receiver: userId,
    });

    return SuccessResponse(res, 200, "Friend request rejected and removed");
  } catch (error) {
    console.error("Error in rejectFriendRequest", error);
    return ErrorResponse(res, 500, "Internal server error");
  }
};
