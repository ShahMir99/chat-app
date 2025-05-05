"use client";

import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { useSocket } from "@/context/SocketContext";
import useConversation from "@/hooks/useConversation";


const Body = ({messages} : any) => {
  const { socket } = useSocket();
  const {conversationId} = useConversation()
  const BottomRef = useRef<HTMLDivElement>(null)
  const [chatMessages , setChatMessages] = useState<any>([])


  
  useEffect(() => {
    if(!socket) return

    socket.on("message:receive", (message : any) => {

      if(message.conversation !== conversationId) return
      setChatMessages((prev : any) => [...prev, message])
      BottomRef?.current?.scrollIntoView()
    })

    return () => { 
      socket.off("message:receive")
    }
  },[socket, conversationId, BottomRef])


  useEffect(() => {
    setChatMessages(messages);
    
    const timeout = setTimeout(() => {
      BottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  
    return () => clearTimeout(timeout);
  }, [messages, BottomRef]);

  return (
    <div style={{backgroundImage : `url("/images/defaultBackground-image.jpeg")`}} className="flex-1 overflow-y-auto pt-2 bg-contain bg-current">
      {chatMessages?.map((message : any, i : any) => (
        <MessageBox
          key={message._id}
          isLast={i === chatMessages.length - 1}
          data={message}
        />
      ))}
      <div ref={BottomRef} className="pt-10" />
    </div>
  );
};

export default Body;
