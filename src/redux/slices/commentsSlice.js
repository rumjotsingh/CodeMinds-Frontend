import axiosInstance from "../../config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Base API URL
const BASE_URL = "";

// Thunk to fetch comments
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (problemId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/problems/${problemId}/comments`
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Thunk to post a comment
export const postComment = createAsyncThunk(
  "comments/postComment",
  async ({ problemId, content }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/problems/${problemId}/comments`,
        { content }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const problemCommentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch comments";
      })

      // Post Comment
      .addCase(postComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload); // Add new comment to list
      })
      .addCase(postComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to post comment";
      });
  },
});

export const { clearComments } = problemCommentsSlice.actions;
export default problemCommentsSlice.reducer;
