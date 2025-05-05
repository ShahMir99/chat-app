"use client";

import { RootState } from "@/store/Store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BiLoaderAlt } from "react-icons/bi";

const MainPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
        router.push("/conversations");
      }
  },[isAuthenticated, router])

  return <div className="w-full h-screen flex items-center justify-center">
        <BiLoaderAlt className="w-6 h-6 text-blue-500 animate-spin"/>
  </div>;
};

export default MainPage;
