import axiosInstance from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch problems
export const fetchProblems = createAsyncThunk(
  "problems/fetchProblems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/problems");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch problems"
      );
    }
  }
);

// Thunk to fetch tags
export const fetchTags = createAsyncThunk(
  "problems/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/problems/tags");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags"
      );
    }
  }
);

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    items: [],
    status: "idle",
    error: null,

    tags: [],
    tagsStatus: "idle",
    tagsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Problems
      .addCase(fetchProblems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Tags
      .addCase(fetchTags.pending, (state) => {
        state.tagsStatus = "loading";
        state.tagsError = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tagsStatus = "succeeded";
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.tagsStatus = "failed";
        state.tagsError = action.payload;
      });
  },
});

export default problemsSlice.reducer;
