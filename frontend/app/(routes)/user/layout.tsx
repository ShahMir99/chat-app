import CoversationList from "@/components/conversations/CoversationList";
import Sidebar from "@/components/sidebar/Sidebar";
import FindPeopleList from "@/components/user/FindPeopleList";

export default function UserRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <FindPeopleList />
        {children}
        </div>
    </Sidebar>
  );
}
