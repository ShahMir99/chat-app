"use client";

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import peopleSlice from "./slices/frineds/People";
import conversationSlice from "./slices/conversation/conversation";
import { ErrorMiddleware } from "@/middleware/ErrorMiddleware";
import { SuccessMiddleware } from "@/middleware/SuccessMiddleware";

export const store = configureStore({
  reducer: {
    auth : authSlice,
    people : peopleSlice,
    conversation : conversationSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ErrorMiddleware, SuccessMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
