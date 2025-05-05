"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import PeopleBox from "./PeopleBox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/Store";
import { getFriendRequest, getPeople } from "@/store/slices/frineds/People";
import FriendRequestBox from "./FriendRequestBox";
import useConversation from "@/hooks/useConversation";

const FindPeopleList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { people, friendRequest } = useSelector(
    (state: RootState) => state.people
  );

  const { conversationId } = useConversation();

  useEffect(() => {
    dispatch(getPeople());
    dispatch(getFriendRequest());
  }, [dispatch]);

  return (
    <aside
      className={cn(
        "w-full fixed inset-y-0 lg:pb-0 pb-20 px-2 left-16 lg:left-20 lg:px-0 lg:w-[340px] lg:block overflow-y-auto border-r border-gray-200 ",
        conversationId && "hidden"
      )}
    >
      <div className="h-full pl-3 pr-2">
        {!!friendRequest?.length && (
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-neutral-900 py-4 ">
              Friend Request
            </h2>
            <div className="h-full overflow-y-auto">
              {friendRequest?.map((request: any) => (
                <FriendRequestBox key={request._id} data={request} />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-neutral-900 py-4">
            Find Friends
          </h2>
          {!people.length && (
            <div className="flex items-center justify-center mt-10 font-light text-gray-500">
              Empty
            </div>
          )}
          <div className="h-full overflow-y-auto">
            {people?.map((people: any) => (
              <PeopleBox key={people._id} data={people} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FindPeopleList;
