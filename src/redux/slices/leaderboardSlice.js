import axiosInstance from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch leaderboard data
export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/leaderboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leaderboard"
      );
    }
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearLeaderboard: (state) => {
      state.users = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
