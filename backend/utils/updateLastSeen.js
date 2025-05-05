import { User } from "../models/user.model.js";

export const updateLastSeen = async (loggedOutUserId) => {
  try {
    const lastSeen = new Date();
    const userData = await User.findByIdAndUpdate(
      loggedOutUserId,
      { lastSeen },
      { new: true }
    ).select("_id name lastSeen profilePic");

    return userData;
  } catch (error) {
    console.log("error in updating last seen", error);
  }
};
