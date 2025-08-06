import axiosInstance from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --- Thunks --- //

// Fetch all problems
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

// Fetch problem by ID
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

// Fetch tags
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

// Run code
export const runCode = createAsyncThunk(
  "problem/runCode",
  async ({ problemId, languageId, sourceCode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/run", {
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

// Submit code
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

// Create new problem
export const createProblem = createAsyncThunk(
  "problems/createProblem",
  async (problemData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/problems",
        problemData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update problem
export const updateProblem = createAsyncThunk(
  "problems/updateProblem",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/problems/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete problem
export const deleteProblem = createAsyncThunk(
  "problems/deleteProblem",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/problems/${id}`);
      return id; // just return the id for local state update
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Slice --- //
const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    getById: null,

    // Tags
    tags: [],
    tagsStatus: "idle",
    tagsError: null,

    // Code run/submit
    runStatus: "idle",
    runError: null,
    runResult: null,
    submitStatus: "idle",
    submitError: null,
    submitResult: null,

    // Create/Update/Delete
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
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
      // Fetch problems
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

      // Fetch problem by id
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

      // Fetch tags
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
      })

      // Run code
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

      // Submit code
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
      })

      // Create
      .addCase(createProblem.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // Update
      .addCase(updateProblem.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.getById && state.getById._id === action.payload._id) {
          state.getById = action.payload;
        }
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Delete
      .addCase(deleteProblem.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((p) => p._id !== action.payload);
        if (state.getById && state.getById._id === action.payload) {
          state.getById = null;
        }
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

export const { clearRunResult, clearSubmitResult } = problemsSlice.actions;
export default problemsSlice.reducer;
