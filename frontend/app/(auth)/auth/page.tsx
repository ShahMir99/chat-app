"use client"

import FormComponenet from "@/components/Auth/FormComponent";
import Image from "next/image";

export default function AuthPage() {
  return (
    <div
      className="
    h-full
    w-full
    bg-gray-100
    flex
    items-center
    justify-center
    "
    >
      <div className="sm:mx-auto w-full max-w-sm lg:max-w-md p-4">
        <Image
          src="/images/logo.png"
          alt=""
          height={35}
          width={35}
          className="mx-auto w-auto"
        />
        <h1
          className="
        mt-2
        text-center
        text-2xl
        font-bold
        tracking-tight
        text-gray-900
        "
        >
          Sign in to your account
        </h1>
        <div
          className="
        bg-white
        pt-10
        p-5
        mt-5
        shadow-md
        rounded-md
        "
        >
          <FormComponenet />
        </div>
      </div>   
    </div>
  );
}
