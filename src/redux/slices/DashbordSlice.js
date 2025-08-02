import axiosInstance from "../../config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async () => {
    const res = await axiosInstance.get("/api/v1/user/dashboard");
    return res.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { data: null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    });
  },
});
export default dashboardSlice.reducer;
