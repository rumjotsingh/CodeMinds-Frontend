// redux/slices/submissionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "./../../config/axios";

// 👉 Fetch all submissions for a given problemId
export const fetchSubmissionsByProblem = createAsyncThunk(
  "submissions/fetchByProblem",
  async (problemId, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/api/v1/submissions");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 👉 Fetch single submission by _id
export const fetchSubmissionById = createAsyncThunk(
  "submissions/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/v1/submissions/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSubmissionsByProblemById = createAsyncThunk(
  "submissions/fetchSubmissionsByProblemById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/v1/submissions/problem/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    list: [],
    problemSubmission: null,
    single: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSingleSubmission(state) {
      state.single = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchSubmissionsByProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSubmissionsByProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchSubmissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(fetchSubmissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch problem
      .addCase(fetchSubmissionsByProblemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.problemSubmission = action.payload;
      })
      .addCase(fetchSubmissionsByProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSingleSubmission } = submissionsSlice.actions;
export default submissionsSlice.reducer;
