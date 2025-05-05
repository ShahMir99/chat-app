"use client";

import Avatar from "@/components/Avatar";
import { useSocket } from "@/context/SocketContext";
import useOtherUser from "@/hooks/useOtherUser";
import { formatLastSeen } from "@/lib/lastSeenFormat";
import { AppDispatch, RootState } from "@/store/Store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  conversation: any;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [conversationData, setConversationData] = useState<any>(conversation);
  const otherUser = useOtherUser(conversationData?.participants);
  const { onlineUser } = useSelector((state: RootState) => state.conversation);


  useEffect(() => {
    if (!socket) return;
    socket.on("typing:start-typing", () => setIsTyping(true));
    socket.on("typing:stop-typing", () => setIsTyping(false));

    return () => {
      socket.off("typing:start-typing");
      socket.off("typing:stop-typing");
    };
  }, [socket]);

  
  return (
    <>
      <div className="bg-[#f0f2f5] w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center ">
        <div className="flex gap-3 items-center ">
          <Link
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={25} />
          </Link>

          <Avatar
            className="lg:w-10 lg:h-10"
            url={otherUser.profilePic}
            isActive={onlineUser.includes(otherUser._id)}
          />

          <div className="flex flex-col">
            <div className="font-medium capitalize">{otherUser.name}</div>
            {isTyping ? (
              <div className="text-[12px] text-gray-500 font-normal leading-4">
                Typing...
              </div>
            ) : (
              <div className="text-[12px] text-gray-500 font-normal leading-4">
                {onlineUser.includes(otherUser._id)
                  ? "Online"
                  : formatLastSeen(otherUser.lastSeen)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
