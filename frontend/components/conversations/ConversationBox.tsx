"use client";

import { RootState } from "@/store/Store";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Avatar from "../Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatLastMessageTime } from "@/lib/lastSeenFormat";

interface ConversationBoxProps {
  data: any;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const router = useRouter()
  const otherUser = useOtherUser(data?.participants);
  const {onlineUser} = useSelector((state : RootState) => state.conversation)
  const {user} = useSelector((state : RootState) => state.auth)

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data._id}`);
  }, [data._id, router]);

  const lastMessageText = useMemo(() => {
    if (data.lastMessage) {

      return data.lastMessage.content
    }
    return "Started a conversation";
  }, [data.lastMessage]);

  const lastMessageTime = useMemo(() => {
    if (data.lastMessage) {
      return data.lastMessage.createdAt
    }

    return data.createdAt;
  }, [data.lastMessage, data.createdAt]);

  const hasSeen = useMemo(() => {

    if (!data?.lastMessage) {
      return false;
    }
    const seenArray = data.lastMessage.readBy || [];

    return seenArray.includes(user?._id)
  },[user?._id, data?.lastMessage])


  return (
    <div
      onClick={handleClick}
      className={cn(
        "group w-full relative flex items-center space-x-3 pl-3 h-[72px] hover:bg-neutral-100 transition cursor-pointer",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <div className="my-auto">
      <Avatar className="lg:w-13 lg:h-13" url={otherUser.profilePic} isActive={onlineUser?.includes(otherUser._id)}/>
      </div>

      <div className={`min-w-0 flex-1 h-full border-b border-[#e9edef] group-hover:border-b-0 ${selected ? "border-b-0" : ""}`}>
        <div className="focus:outline-none my-auto flex flex-col justify-center h-full">
          <div className="flex justify-between items-center pr-4">
            <p className="text-base text-gray-900 font-[400]">
              {otherUser?.name}
            </p>

            <p className="text-xs font-light text-gray-500">
              {formatLastMessageTime(lastMessageTime)}
            </p>
          </div>
          <p className={cn("text-[14px] truncate font-[300] ", hasSeen ? "text-gray-500" : "text-neutral-800 font-medium")}>
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
