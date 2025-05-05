import express from "express";
import { checkAuth, login, signUp, logOut, emailVerification, forgotPassword ,resetPassword } from "../controllers/auth.controller.js";
import { verifyUserToken } from "../middleware/verifyUserToken.js";

const router = express.Router()

router.get("/check-auth", verifyUserToken, checkAuth)

router.post("/sign-up", signUp)
router.post("/login", login)
router.get("/logout", logOut)

router.post("/email-verification", emailVerification)
router.post("/forgot-password", forgotPassword)
router.patch("/reset-password/:token", resetPassword)

export default router