import jwt from "jsonwebtoken";

import { Config } from "../configs/index.js";

export const generateToken = (res, user) => {
  const token = jwt.sign(
    { userId: user._id, userRole: user.role },Config.jwtSecret,{
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",             // Required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

};
