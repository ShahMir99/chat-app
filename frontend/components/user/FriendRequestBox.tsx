"use client"

import React, { useOptimistic, startTransition, useState } from "react";
import Avatar from "../Avatar";
import { Button } from "../ui/button";
import { BsPersonFillAdd, BsPersonFillDash } from "react-icons/bs";
import { IoArrowRedoSharp } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import Axios from "@/lib/ApiConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

interface IFriendRequestBox {
  data: any;
}

const FriendRequestBox: React.FC<IFriendRequestBox> = ({ data }) => {
  const [status, setStatus] = useState<string>(data.status);
  const {onlineUser} = useSelector((state : RootState) => state.conversation)
  const [isDisabled, setIsDisabled] = useState(false);

  const acceptRequest = async (userId: string) => {
    setIsDisabled(true);
    setStatus("friend");
    try {
      await Axios.patch("/user/accept-friend-request", {
        userWhoSentRequest: userId,
      });
    } catch (error: any) {
      setStatus(data.status);
      console.log("error in sending request", error);
    } finally {
      setTimeout(() => setIsDisabled(false), 500);
    }
  };

  return (
    <>
      <div className="relative w-full flex items-start space-x-3 bg-white py-3 px-2 hover:bg-neutral-50 rounded-lg transition ">
        <Avatar className="lg:w-12 lg:h-12" url={data?.sender?.profilePic} isActive={onlineUser?.includes(data?.sender?._id)} />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col mt-2">
            <h1 className="text-[14px] font-semibold text-gray-900">
              {data?.sender?.name}
            </h1>
            <p className="text-[12px] font-light text-gray-700">
              {status === "friend" ? (
                <span>Request Accepted</span>
              ) : (
                <span>{data?.sender?.bio}</span>
              )}
            </p>
          </div>

          {status === "pending" && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                disabled={isDisabled}
                onClick={() => acceptRequest(data?.sender?._id)}
                className="h-auto py-2 px-3  font-medium text-[14px] cursor-pointer bg-blue-600 hover:bg-blue-600 flex items-center rounded-sm"
              >
                Confirm
              </Button>
              <Button
                disabled={isDisabled}
                className="h-auto py-2 px-3  font-medium text-[14px] cursor-pointer bg-gray-200 hover:bg-gray-200 flex items-center rounded-sm text-black"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <span className="block w-full h-[1px] bg-gray-200" />
    </>
  );
};

export default FriendRequestBox;
