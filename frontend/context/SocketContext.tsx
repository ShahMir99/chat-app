"use client";

import { RootState } from "@/store/Store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io as ClientIO , Socket} from "socket.io-client";

interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: Socket,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {user} = useSelector((state : RootState) => state.auth)
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!user?._id) return; 
    
    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_BACKEND_URL, {
      query : {
        userId : user?._id
      }
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext value={{ socket, isConnected }}>{children}</SocketContext>
  );
};
