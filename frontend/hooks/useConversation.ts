"use client";
import { useParams } from "next/navigation";

const useConversation = () => {
  const params = useParams();

  const conversationId = (params?.conversationId as string) || "";
  const isOpen = !!conversationId;

  return { conversationId, isOpen };
};

export default useConversation;
