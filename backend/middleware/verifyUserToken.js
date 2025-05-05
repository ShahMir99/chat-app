import jwt from "jsonwebtoken";
import { Config } from "../configs/index.js";

export const verifyUserToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const decodeToken = jwt.verify(token, Config.jwtSecret);

    if (!decodeToken) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    req.userId = decodeToken.userId;
    req.userRole = decodeToken.userRole;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
