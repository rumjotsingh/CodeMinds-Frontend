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

export const fetchProblemsById = createAsyncThunk(
  "problems/fetchProblemsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/problems/${id}`);

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
export const runCode = createAsyncThunk(
  "problem/runCode",
  async ({ problemId, languageId, sourceCode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/run", {
        problemId,
        languageId,
        sourceCode,
      });
      return response.data; // expect your result JSON here
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitCode = createAsyncThunk(
  "problem/submitCode",
  async ({ problemId, languageId, sourceCode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/submit", {
        problemId,
        languageId,
        sourceCode,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    getById: null,

    tags: [],
    tagsStatus: "idle",
    tagsError: null,

    runStatus: "idle", // loading state for run
    runError: null,
    runResult: null, // store run code response
    submitStatus: "idle", // loading state for submit
    submitError: null,
    submitResult: null,
  },
  reducers: {
    clearRunResult: (state) => {
      state.runResult = null;
      state.runStatus = "idle";
      state.runError = null;
    },
    clearSubmitResult: (state) => {
      state.submitResult = null;
      state.submitStatus = "idle";
      state.submitError = null;
    },
  },
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
      });
    builder
      // Problems
      .addCase(fetchProblemsById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProblemsById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.getById = action.payload;
      })
      .addCase(fetchProblemsById.rejected, (state, action) => {
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
    builder
      // RunCode Thunk
      .addCase(runCode.pending, (state) => {
        state.runStatus = "loading";
        state.runError = null;
        state.runResult = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.runStatus = "succeeded";
        state.runResult = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.runStatus = "failed";
        state.runError = action.payload;
      })

      // SubmitCode Thunk
      .addCase(submitCode.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
        state.submitResult = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.submitResult = action.payload;
      })
      .addCase(submitCode.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload;
      });
  },
});
export const { clearRunResult, clearSubmitResult } = problemsSlice.actions;
export default problemsSlice.reducer;
