import { Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { clearMessage } from "@/store/slices/auth/authSlice"; // Adjust the path as needed

export const SuccessMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  // Show success message for all fulfilled actions only if there's a message
  if (action.type.startsWith("auth/") && action.type.endsWith("/fulfilled")) {
    const successMessage = action.payload?.message;

    // Check if there is a success message before showing the toast
    if (successMessage) {
      toast.success(successMessage, {
        onClose: () => {
          storeAPI.dispatch(clearMessage());
        },
      });
    }
  }

  return next(action);
};
