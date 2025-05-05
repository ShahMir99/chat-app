"use client";

import { cn } from "@/lib/utils";
import { getConversations } from "@/store/slices/conversation/conversation";
import { AppDispatch, RootState } from "@/store/Store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useConversation from "@/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import useOtherUser from "@/hooks/useOtherUser";

const CoversationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations } = useSelector((state: RootState) => state.conversation);
  const { conversationId } = useConversation();


  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <aside
      className={cn("w-full fixed inset-y-0 lg:pb-0 pb-20 px-2 lg:left-16 lg:px-0 lg:w-[397px] lg:block overflow-y-auto border-r border-gray-200 ", 
        conversationId && "hidden"
      )}
    >
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-neutral-900 p-4 ">
          Chats
          </h2> 

          {/* THIS IS THE PLACE FOR INPUT FIELDS TO SEARCH THE CHATS */}
          {/* <div className="">
            <input type="text" />
          </div> */}
          
          <div className="h-full overflow-y-auto">
            {[...conversations]
            ?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            ?.map((data) => (
              <ConversationBox
                key={data._id}
                data={data}
                selected={conversationId === data._id}
              />
            ))}
          </div>
        </div>
    </aside>
  );
};

export default CoversationList;
