import { SocketProvider } from "@/context/SocketContext";
import AuthRefetchProvider from "@/providers/AuthRefetchProvider";
import SocketEventProvider from "@/providers/SocketEventProvider";


export default function InitialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <SocketProvider>
        <AuthRefetchProvider />
        <SocketEventProvider />
        {children}
      </SocketProvider>
    </div>
  );
}
