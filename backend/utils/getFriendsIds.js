import { Block } from "../models/block.model.js";
import { Friend } from "../models/friend.model.js";

export const getFriendsSocketIds = async (loggedOutUserId, userMappingWithId) => {
  try {

    const [blockedUsers, friends] = await Promise.all([
      Block.find({ blockedBy: loggedOutUserId }).select("blockedUser"),
      Friend.find({
        $or: [{ sender: loggedOutUserId }, { receiver: loggedOutUserId }],
        status: "accepted",
      }),
    ]);
    
    const blockedSet = new Set(blockedUsers.map((b) => b.blockedUser.toString()));

    const friendIds = friends
      .map((f) =>
        f.sender.toString() === loggedOutUserId
          ? f.receiver.toString()
          : f.sender.toString()
      )
      .filter((id) => !blockedSet.has(id));

    const socketIds = friendIds
      .map((id) => userMappingWithId.get(id))
      .filter(Boolean);

    return socketIds;
  } catch (error) {
    console.error("Error in getFriendsSocketIds:", error);
    return [];
  }
};
