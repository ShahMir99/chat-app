"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/store/slices/auth/authSlice"; // make sure it's exported
import { AppDispatch } from "@/store/Store";

const AuthRefetchProvider = () => {
  
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return null;
};

export default AuthRefetchProvider;