import express from "express"
import { verifyUserToken } from "../middleware/verifyUserToken.js";
import { getAllConversation, getConversationById } from "../controllers/conersation.controller.js";

const router = express.Router()

router.get("/get-all", verifyUserToken, getAllConversation)
router.get("/:id", verifyUserToken, getConversationById)


export default router;