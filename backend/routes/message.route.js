import express from "express"
import { verifyUserToken } from "../middleware/verifyUserToken.js";
import { sendMessage, getMessagesByConversationId } from "../controllers/message.controller.js";

const router = express.Router()

router.post("/send-message", verifyUserToken, sendMessage)
router.get("/get-messages/:conversationId", verifyUserToken, getMessagesByConversationId)


export default router;