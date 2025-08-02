import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../config/axios";

export const fetchStreaks = createAsyncThunk(
  "streaks/fetchStreaks",
  async () => {
    const res = await axiosInstance.get("/api/v1/user/streaks");
    return res.data;
  }
);

const streakSlice = createSlice({
  name: "streaks",
  initialState: { data: {}, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStreaks.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    });
  },
});
export default streakSlice.reducer;
