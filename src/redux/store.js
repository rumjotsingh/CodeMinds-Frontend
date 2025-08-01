// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import problemReducer from "../redux/slices/problemSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer,
  },
});
