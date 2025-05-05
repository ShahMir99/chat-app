import CoversationList from "@/components/conversations/CoversationList";
import Sidebar from "@/components/sidebar/Sidebar";

export default function ConversationRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <CoversationList />
        {children}
        </div>
    </Sidebar>
  );
}
