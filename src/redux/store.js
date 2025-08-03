// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import problemReducer from "../redux/slices/problemSlice";
import dashboardReducer from "../redux/slices/DashbordSlice";
import streakReducer from "../redux/slices/StreaksSlice";
import playlistReducer from "../redux/slices/playlistSlice";
import commentsReducer from "../redux/slices/commentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer,
    dashboard: dashboardReducer,
    streaks: streakReducer,
    playlists: playlistReducer,
    comments: commentsReducer,
  },
});
