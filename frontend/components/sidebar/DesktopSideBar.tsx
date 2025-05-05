"use client"

import useRoutes from "@/hooks/useRoutes";
import { useState } from "react";
import DesktopItems from "./DesktopItems";

const DesktopSideBar = () => {
  const [isOpen, setOpen] = useState(false);
  const routes = useRoutes()

  return (
    <>
      <div
        className="
          hidden
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:w-[65px]
          xl:px-6
          overflow-y-auto
        bg-[#f0f2f5]
          lg:border-r-[2px]
          lg:pb-4
          lg:flex
          lg:flex-col
          justify-between
    "
      >
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            "
        >
          <ul
            role="list"
            className="
              flex
              items-center
              flex-col
              space-y-1
        "
          >
            {routes.map((item) => (
              <DesktopItems
                key={item.label}
                href={item.href}
                label={item.label}
                Icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            items-center
      "
        >
          <div
            onClick={() => setOpen(true)}
            className="
              cursor-pointer
              hover:opacity-75
              transition
       "
          >
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSideBar;
