import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ErrorResponse, SuccessResponse } from "../utils/responseHandler.js";
import { getUserSocketId, IO } from "../utils/socket.js";

export const sendMessage = async (req, res) => {
    try {
      const userId = req.userId;
      const { message, conversationId, attachments = [], messageType = "text" } = req.body;
  
      if (!conversationId) {
        return ErrorResponse(res, 400, "conversationId is missing");
      }
  
      const newMessage = await Message.create({
        sender: userId,
        content: message || "A new Conversation has been started...",
        conversation: conversationId,
        messageType,
        attachments,
        readBy: [userId],
      });

      const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name profilePic")
      .populate("readBy", "name")


      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        },
        { new: true })
        .populate({
            path : "lastMessage",
            populate : {
                path : "sender",
                select : "name profilePic lastSeen"
            }
        })
        .populate("participants.userId", "name profilePic lastSeen")
  

        const participants = updatedConversation.participants
        const otherUser = participants.find((user) => user.userId._id.toString() !== userId)

        const receiverSocketId = getUserSocketId(otherUser.userId._id.toString());
        const yourSocketId = getUserSocketId(userId);

      IO().to([receiverSocketId, yourSocketId]).emit("message:receive", populatedMessage)
      IO().to([receiverSocketId, yourSocketId]).emit("conversation:update", updatedConversation)
      return SuccessResponse(res, 200, "message sent successfully", updatedConversation)

    } catch (error) {
      console.error("Error in sendMessage:", error);
      return ErrorResponse(res, 500, "Internal server error");
    }
  };


  export const getMessagesByConversationId = async (req, res) => {
    try {
      const {conversationId} = req.params

      if (!conversationId) {
        return ErrorResponse(res, 400, "conversationId is missing");
      }
  
      const messages = await Message.find({ conversation: conversationId })
      .sort({createdAt : 1})
      .populate("sender", "name profilePic")
      .populate("readBy", "name")
      


      return SuccessResponse(res, 200, "you got all messages", messages);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return ErrorResponse(res, 500, "Internal server error");
    }
  };
