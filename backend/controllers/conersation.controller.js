import { Block } from "../models/block.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Friend } from "../models/friend.model.js";
import { ErrorResponse, SuccessResponse } from "../utils/responseHandler.js";


export const getAllConversation = async (req, res) => {
    try {
      const userId = req.userId;
  

      const [blockedUsers, friends] = await Promise.all([
        Block.find({ blockedBy: userId }).select("blockedUser"),
        Friend.find({
          $or: [
            { sender: userId },
            { receiver: userId },
          ],
          status: "accepted",
        }),
      ]);
  
      const blockedUserSet = new Set(blockedUsers.map(b => b.blockedUser.toString()));

      const validFriendIds = friends.reduce((acc, f) => {
        const otherId = f.sender.toString() === userId ? f.receiver.toString() : f.sender.toString();
        if (!blockedUserSet.has(otherId)) acc.push(otherId);
        return acc;
      }, []);

  
     
      const conversations = await Conversation.find({
        isGroupchat: false,
        participants: {
          $all: [
            { $elemMatch: { userId: userId } },
            { $elemMatch: { userId: { $in: validFriendIds } } },
          ],
        },
      })
      .populate("participants.userId", "name profilePic")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name profilePic" },
      })
      .sort({ updatedAt: -1 });
  

      return SuccessResponse(res, 200, "Get all conversation successfully", conversations);
    } catch (error) {
      console.error("Error in fetching getAllConversation", error);
      return ErrorResponse(res, 500, "Internal server error");
    }
  };



export const getConversationById = async (req, res) => {
    try{
      const conversationId = req.params.id;

      if(!conversationId){
        return ErrorResponse(res, 401, "conversationId is not present");
      }

      const conversation = await Conversation.findById(conversationId)
      .populate("participants.userId" , "name profilePic lastSeen")
      .populate({
        path : "lastMessage",
        populate : {
          path : "sender",
          select : "name profilePic lastSeen"
        }
      })

      return SuccessResponse(res, 200, "Get conversation by id", conversation);
    } catch (error) {
      console.error("Error in fetching conversation by Id", error);
      return ErrorResponse(res, 500, "Internal server error");
    }
}