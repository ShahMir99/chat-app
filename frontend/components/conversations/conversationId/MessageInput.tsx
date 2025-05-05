"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  type?: string;
  errors: FieldErrors;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  register,
  type,
  errors,
  onKeyUp,
  placeholder,
  required,
}) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete="off"
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        {...register(id, { required })}
        className="text-black font-light py-2 px-4 bg-white w-full rounded-md focus:outline-none placeholder:text-neutral-600"
      />
    </div>
  );
};

export default MessageInput;
