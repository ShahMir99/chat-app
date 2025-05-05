"use client";

import { cn } from "@/lib/utils";
import { clearConversationNotification } from "@/store/slices/conversation/conversation";
import { clearPeopleNotification } from "@/store/slices/frineds/People";
import { AppDispatch, RootState } from "@/store/Store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface DesktopItems {
  label: string;
  Icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItems: React.FC<DesktopItems> = ({
  label,
  Icon,
  href,
  onClick,
  active,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const { PeoplenotiCount } = useSelector((state: RootState) => state.people);
  const { ConversationNotiCount } = useSelector(
    (state: RootState) => state.conversation
  );

  const handleClick = () => {
    if (onClick) {
      const result = onClick();
      console.log("typeof result === function", typeof result === "function");
      if (typeof result === "function") {
        try {
          dispatch(result);
        } catch (error) {
          console.log("Error in logout");
        } finally {
          window.location.assign("/auth");
        }
      }
    }
  };

  useEffect(() => {
    if (pathname === "/user") {
      if (PeoplenotiCount) {
        dispatch(clearPeopleNotification());
      }
    }
    if (pathname === "/conversations") {
      if (ConversationNotiCount) {
        dispatch(clearConversationNotification());
      }
    }
  }, [pathname, dispatch, PeoplenotiCount, ConversationNotiCount]);

  return (
    <li
      onClick={handleClick}
      className={cn(
        "relative group flex gap-y-3 rounded-full p-[10px] text-sm leading-6 font-semibold text-gray-500",
        active && "bg-[#d9dbdf] text-gray-600"
      )}
    >
      <Link href={href}>
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
      {ConversationNotiCount && href === "/conversations" ? (
        <span className="absolute top-2 right-[5px] w-3 h-3 rounded-md bg-blue-500 shrink-0 flex items-center justify-center text-white text-[8px]">
          {ConversationNotiCount}
        </span>
      ) : null}
      {PeoplenotiCount && href === "/user" ? (
        <span className="absolute top-2 right-[5px] w-3 h-3 rounded-md bg-blue-500 shrink-0 flex items-center justify-center text-white text-[8px]">
          {PeoplenotiCount}
        </span>
      ) : null}
    </li>
  );
};

export default DesktopItems;
