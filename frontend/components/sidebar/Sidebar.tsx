"use client"

import DesktopSideBar from "./DesktopSideBar";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <DesktopSideBar />
      <main className="h-full">{children}</main>
    </div>
  );
};

export default Sidebar;
