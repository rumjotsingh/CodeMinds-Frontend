import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// Async thunks
export const fetchAllPlaylists = createAsyncThunk(
  "playlists/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/playlists");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlists/create",
  async (playlistData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/playlists",
        playlistData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlists/update",
  async ({ playlistId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/playlists/${playlistId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  "playlists/getById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/playlists/${playlistId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProblemToPlaylist = createAsyncThunk(
  "playlists/addProblem",
  async ({ playlistId, problemId }, { rejectWithValue }) => {
    console.log(playlistId, problemId);
    try {
      const response = await axiosInstance.post(
        `/api/v1/playlists/${playlistId}/add`,
        { problemId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProblemFromPlaylist = createAsyncThunk(
  "playlists/removeProblem",
  async ({ playlistId, problemId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/playlists/${playlistId}/remove`,
        {
          problemId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlists/delete",
  async (playlistId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/playlists/${playlistId}`);
      return playlistId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  playlists: [],
  currentPlaylist: null,
  loading: false,
  error: null,
  success: false,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all playlists
      .addCase(fetchAllPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.playlists);
        state.playlists = action.payload.playlists;
      })
      .addCase(fetchAllPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.push(action.payload);
        state.success = true;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update playlist
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.playlists.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get playlist by ID
      .addCase(getPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylist = action.payload;
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add problem to playlist
      .addCase(addProblemToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProblemToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.playlists.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
        state.success = true;
      })
      .addCase(addProblemToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove problem from playlist
      .addCase(removeProblemFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProblemFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.playlists.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
        state.success = true;
      })
      .addCase(removeProblemFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete playlist
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = state.playlists.filter(
          (p) => p._id !== action.payload
        );
        if (state.currentPlaylist?._id === action.payload) {
          state.currentPlaylist = null;
        }
        state.success = true;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = playlistSlice.actions;
export default playlistSlice.reducer;
