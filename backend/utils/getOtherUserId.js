import { Conversation } from "../models/conversation.model.js";

export const getOtherUserId = async (
  userId,
  conversationId,
  userMappingWithId
) => {
  try {
    if (!conversationId) {
      return null;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return null;
    }
    const participants = conversation.participants;
    const otherUser = participants.find(
      (user) => user.userId._id.toString() !== userId
    );

    const socketId = userMappingWithId.get(otherUser.userId.toString());
    if (socketId) {
      return socketId;
    }

    return null;
  } catch (error) {
    console.log("Error in getOtherUserId", error);
    return null;
  }
};
