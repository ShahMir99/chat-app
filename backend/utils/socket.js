import { Server } from "socket.io";
import { Config } from "../configs/index.js";
import { updateLastSeen } from "./updateLastSeen.js";
import { getFriendsSocketIds } from "./getFriendsIds.js";
import { getOnlineUserIds } from "./getOnlineUserIds.js";
import { getOtherUserId } from "./getOtherUserId.js";

const userMappingWithId = new Map();

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: Config.clientUrls,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    userMappingWithId.set(userId, socket.id);

    console.log(`A user Joined With This Id ${userId} and This Socket Id ${socket.id}`);

    socket.on("userJoined", () => {
      const onlineUsers = getOnlineUserIds(userMappingWithId);
      io.emit("getOnlineUserList", { onlineUsers });
    });

    socket.on("typing:start", async ({ conversationId }) => {
      const socketId = await getOtherUserId(
        userId,
        conversationId,
        userMappingWithId
      );
      io.to(socketId).emit("typing:start-typing");
    });

    socket.on("typing:stop", async ({ conversationId }) => {
      const socketId = await getOtherUserId(
        userId,
        conversationId,
        userMappingWithId
      );
      io.to(socketId).emit("typing:stop-typing");
    });

    socket.on("disconnect", async () => {
      if (userId) {
        const userData = await updateLastSeen(userId);
        const idsToSendEvent = await getFriendsSocketIds(
          userId,
          userMappingWithId
        );

        userMappingWithId.delete(userId);

        const onlineUsers = getOnlineUserIds(userMappingWithId);

        io.to([...idsToSendEvent]).emit("conversation:updateLastSeen", {
          userData,
        });
        io.emit("getOnlineUserList", { onlineUsers });
      }
    });
  });

  return io;
};

export const IO = () => io;
export const getUserSocketId = (id) => userMappingWithId.get(id);
