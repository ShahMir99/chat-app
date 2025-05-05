"use client";

import { useSocket } from "@/context/SocketContext";
import useAudio from "@/hooks/useAudio";
import {
  setConversation,
  setConversationNotification,
  setOnlineUser,
  updateConversation,
  updateLastSeen,
} from "@/store/slices/conversation/conversation";
import {
  removePeopleFromList,
  setFriendRequest,
  setPeopleNotification,
} from "@/store/slices/frineds/People";
import { AppDispatch, RootState } from "@/store/Store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SocketEventProvider = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { play: playNotification } = useAudio("/tone/notification.wav");

  useEffect(() => {
    if (!socket) return;

    socket.emit("userJoined");

    socket.on("getOnlineUserList", ({ onlineUsers }: any) => {
      dispatch(setOnlineUser(onlineUsers));
    });

    socket.on("request", ({ findFriendRequest }: any) => {
      dispatch(setFriendRequest(findFriendRequest));
      dispatch(setPeopleNotification());
      playNotification();
    });

    socket.on("friendRequestAccepted", ({ conversaion, removePeopleId }: any) => {
        if (user?._id !== removePeopleId) {
          dispatch(removePeopleFromList(removePeopleId));
        }
        dispatch(setConversation(conversaion));
        dispatch(setConversationNotification());
      }
    );

    // events related to conversations

    socket.on("conversation:updateLastSeen", ({ userData }: any) => {
      dispatch(updateLastSeen({ OtherUserData: userData }));
    });

    socket.on("conversation:update", (updatedConversation: any) => {
      dispatch(updateConversation(updatedConversation));
    });

    return () => {
      socket.off("request");
      socket.off("getOnlineUserList");
      socket.off("friendRequestAccepted");
      socket.off("conversation:updateLastSeen");
      socket.off("conversation:update");
    };
  }, [socket]);

  return null;
};

export default SocketEventProvider;
