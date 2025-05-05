import bcrypt from "bcryptjs";

//local imports
import { SuccessResponse, ErrorResponse } from "../utils/responseHandler.js";
import { User } from "../models/user.model.js";

import { generateToken } from "../utils/generateToken.js";

export const signUp = async (req, res) => {
  const { name, email, password: newPassword, bio, profilePic } = req.body;

  try {
    if (!name) {
      return ErrorResponse(res, 400, "Name is required");
    }

    if (!email) {
      return ErrorResponse(res, 400, "Email is required");
    }

    if (!newPassword) {
      return ErrorResponse(res, 400, "Password is required");
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return ErrorResponse(res, 409, "User already exist");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const VerificationCode = Math.floor(1000000 + Math.random() * 9000000);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      bio,
      profilePic,
      emailVerificationToken: VerificationCode,
      emailVerificationTokenExpires: Date.now() + 10 * 60 * 1000,
    });

    generateToken(res, user);
    const UserInfo = user.toObject();
    const {
      password,
      emailVerificationToken,
      emailVerificationTokenExpires,
      __v,
      isDeleted,
      isBlocked,
      ...rest
    } = UserInfo;

    return SuccessResponse(res, 200, "User register successfully", rest);
  } catch (error) {
    console.log("Error in sign up", error);
    return ErrorResponse(res, 500, error.message);
  }
};

export const login = async (req, res) => {
  const { email, password: newPassword } = req.body;
  try {
    if (!email) {
      return ErrorResponse(res, 400, "Email is required");
    }

    if (!newPassword) {
      return ErrorResponse(res, 400, "Password is required");
    }

    const user = await User.findOne({ email, isDeleted: false }).lean();

    if (!user) {
      return ErrorResponse(res, 400, "Invalid credentials");
    }

    if (user.isBlocked) {
      return ErrorResponse(res, 400, "Your account has been blocked!");
    }

    const isPasswordValid = await bcrypt.compare(newPassword, user.password);

    if (!isPasswordValid) {
      return ErrorResponse(res, 400, "Invalid credentials");
    }

    generateToken(res, user);

    const {
      password,
      emailVerificationToken,
      emailVerificationTokenExpires,
      __v,
      isDeleted,
      isBlocked,
      ...rest
    } = user;

    return SuccessResponse(res, 200, "User logged in successfully", rest);
  } catch (error) {
    console.log("Error in login", error);
    return ErrorResponse(res, 500, error.message);
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,                  
      sameSite: "none",              
      domain: ".mmc-madina.com",    
    });

    return SuccessResponse(res, 200, "User logout Successfully");
  } catch (error) {
    logger.error(error);
    return ErrorResponse(res, 500, "Internal server error");
  }
};

export const emailVerification = async (req, res) => {
  try {
  } catch (error) {
    console.log("error in emailVerification", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
  } catch (error) {
    console.log("error in forgotPassword", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
  } catch (error) {
    console.log("error in resetPassword", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return ErrorResponse(res, 400, "User not found");
    }
    return SuccessResponse(res, 200, "", user);
  } catch (error) {}
};
