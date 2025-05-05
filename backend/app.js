import http from "http";
import express from "express";

import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Config } from "./configs/index.js";
import { ConnectToDataBase } from "./database/db.config.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";

import { initializeSocket } from "./utils/socket.js";

const app = express();
const server = http.createServer(app);
initializeSocket(server);


app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {

        console.log("origin", origin)
        console.log("Config.clientUrls", Config.clientUrls)

      if (!origin || Config.clientUrls.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100MB" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/message", messageRoute);


const Server = server.listen(Config.appPort, () => {
  const protocol =
    process.env.HTTPS === "true" || process.env.NODE_ENV === "production"
      ? "https"
      : "http";
  const addressInfo = Server.address();
  if (addressInfo && typeof addressInfo !== "string" && addressInfo !== null) {
    const { address, port } = addressInfo;
    const host = address === "::" ? "127.0.0.1" : address;
    console.log(`Server is running at ${protocol}://${host}:${port}`);
  } else {
    console.error("Server address is not available.");
  }
});

const DB_Url = Config.databaseUrl;
const DB_Name = Config.databaseName;

ConnectToDataBase(DB_Url, DB_Name);
