import jwt from "jsonwebtoken";

import { Config } from "../configs/index.js";

export const generateToken = (res, user) => {
  const token = jwt.sign(
    { userId: user._id, userRole: user.role },Config.jwtSecret,{
      expiresIn: "7d",
    }
  );

  // Locally
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: Config.nodeEnv === "production",
  //   sameSite: false,
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });


  // PRODUCTION
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".mmc-madina.com",  
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

};
