import express from "express";
import {
  getAllUser,
  getFriendRequest,
  blockUser,
  unblockUser,
  sendFriendRequests,
  cancelFriendRequests,
  rejectFriendRequest,
  acceptFriendRequest,
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../middleware/verifyUserToken.js";

const router = express.Router();

router.get("/get-users", verifyUserToken, getAllUser);
router.get("/get-friend-request", verifyUserToken, getFriendRequest);
router.post("/block-user", verifyUserToken, blockUser);
router.post("/unblock-user", verifyUserToken, unblockUser);

router.post("/send-friend-request", verifyUserToken, sendFriendRequests);
router.post("/send-friend-delete", verifyUserToken, cancelFriendRequests);
router.patch("/accept-friend-request", verifyUserToken, acceptFriendRequest);
router.post("/reject-friend-request", verifyUserToken, rejectFriendRequest);

export default router;
