"use client";

import { RootState } from "@/store/Store";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useOtherUser = (data: any) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const otherUser = useMemo(() => {
    if (user?._id) {
      const findOtherUser = data?.find(
        (participant: any) => user?._id !== participant.userId._id
      );
      return findOtherUser?.userId;
    }
  }, [user?._id, data]);

  return otherUser || {};
};

export default useOtherUser;
