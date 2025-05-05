"use client";

import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/Store";
import { format } from "date-fns";
import Image from "next/image";
import { useSelector } from "react-redux";

const MessageBox = ({ isLast, data }: any) => {

  const { user } = useSelector((state: RootState) => state.auth);
  const isOwn = user?._id === data?.sender?._id;
  
  const seenList = (data?.readBy)
    .filter((person: any) => person._id !== data?.sender?._id)
    .map((person: any) => person.name)
    .join(", ");

  return (
    <div tabIndex={-1} className={cn("flex gap-3 py-1 px-6", isOwn && "justify-end")}>
      <div className={cn("max-w-[600px] flex flex-col gap-2")}>
        <div className={cn("text-sm w-fit")}>
          <div className={cn("px-2 py-0.5 bg-[#d9fdd3] text-neutral-900 font-normal flex items-center gap-3 rounded-lg shadow-sm")}>
            <div className="text-[14px]">{data.content}</div>
            <div className="text-[10px] mt-3">{format(new Date(data.createdAt), "p")}</div>
          </div>
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen By ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
