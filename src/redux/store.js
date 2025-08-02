// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import problemReducer from "../redux/slices/problemSlice";
import dashboardReducer from "../redux/slices/DashbordSlice";
import streakReducer from "../redux/slices/StreaksSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer,
    dashboard: dashboardReducer,
    streaks: streakReducer,
  },
});
