import { clearError, logOutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch } from "@/store/Store";
import { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const ErrorMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.type === "auth/checkAuth/rejected") {
      console.log("Check Auth failed, but no toast shown:", action.payload);
      (storeAPI.dispatch as AppDispatch)(logOutUser());

      if (window.location.pathname !== "/auth") {
        window.location.assign("/auth");
      }
      return;
    }

    const { payload }: any = action;

    toast.error(payload, {
      onClose: () => {
        storeAPI.dispatch(clearError());
      },
    });
  }

  return next(action);
};
