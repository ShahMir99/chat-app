"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/Store";
import { LoginUser, SignUpUser } from "@/store/slices/auth/authSlice";

type Variant = "LOGIN" | "REGISTER";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1),
  password: z.string().min(1),
});

const FormComponenet = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [Variant, setVaiant] = useState<Variant>("LOGIN");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (Variant === "REGISTER") {
      const result = await dispatch(SignUpUser(values));
      if (result.type === "auth/signupUser/fulfilled") {
        router.refresh();
      }
    }
    if (Variant === "LOGIN") {
      const result = await dispatch(LoginUser(values));
      if (result.type === "auth/loginUser/fulfilled") {
        router.refresh();
      }
    }

  };

  const toggleVariant = () => {
    if (Variant === "LOGIN") {
      setVaiant("REGISTER");
    }
    if (Variant === "REGISTER") {
      setVaiant("LOGIN");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col gap-y-3">
            {Variant === "REGISTER" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name"
                        className=" placeholder:text-gray-400"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      className=" placeholder:text-gray-400"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      className=" placeholder:text-gray-400"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button
                type="submit"
                disabled={isLoading}
                className="
                mt-3
                w-full
               bg-blue-500
               shadow-md
               hover:bg-blue-500/80
               text-base
               "
              >
                {Variant === "LOGIN" ? "Sign in" : "Sign up"}
              </Button>
            </div>

            <div
              className="
            flex
            items-center
            justify-center
            gap-2
            text-sm
            mt-2
            px-2
            text-gray-500
            "
            >
              <div>
                {Variant === "LOGIN"
                  ? " New to messanger?"
                  : "Already have an account?"}
              </div>
              <div
                onClick={toggleVariant}
                className="underline cursor-pointer text-blue-800/80"
              >
                {Variant === "LOGIN" ? "Create an account" : "Login"}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormComponenet;
