"use client";

import axios from "axios";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import Axios from "@/lib/ApiConfig";
import useConversation from "@/hooks/useConversation";
import { AppDispatch, RootState } from "@/store/Store";
import { BiPlus } from "react-icons/bi";
import { useSocket } from "@/context/SocketContext";
import { useRef } from "react";

const Form = () => {
  const { socket } = useSocket();
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    try {
      setValue("message", "", { shouldValidate: true });
      Axios.post("/message/send-message", {
        ...data,
        conversationId,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleType = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") return;
    
    if (!socket) return;
    socket.emit("typing:start", {conversationId});
    
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing:stop", {conversationId});
    }, 2000);
  };

  return (
    <div className="px-6 py-4 bg-[#f0f2f5] border-t flex items-center gap-2 lg:gap-4 w-full">
      <BiPlus size={30} className="text-neutral-900 cursor-pointer" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          onKeyUp={handleType}
          placeholder="Write a message"
        />
        <button type="submit" className="rounded-full ">
          <HiPaperAirplane size={25} className="text-gray-600" />
        </button>
      </form>
    </div>
  );
};

export default Form;
