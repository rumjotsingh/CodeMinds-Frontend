// src/redux/slices/announcementSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

// Fetch all
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/v1/announcements");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcements"
      );
    }
  }
);

// Get one by id
export const fetchAnnouncementById = createAsyncThunk(
  "announcements/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/announcements/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcement"
      );
    }
  }
);

// Create
export const createAnnouncement = createAsyncThunk(
  "announcements/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/v1/announcements", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create announcement"
      );
    }
  }
);

// Update
export const updateAnnouncement = createAsyncThunk(
  "announcements/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/api/v1/announcements/${id}`,
        updateData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update announcement"
      );
    }
  }
);

// Delete
export const deleteAnnouncement = createAsyncThunk(
  "announcements/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/announcements/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete announcement"
      );
    }
  }
);

const announcementSlice = createSlice({
  name: "announcements",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    current: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
    currentStatus: "idle",
    currentError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.announcements;
        console.log("fetched announcements", action.payload.announcements);
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch one by id
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload;
      })

      // Create
      .addCase(createAnnouncement.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // Update
      .addCase(updateAnnouncement.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // replace in items array
        const idx = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current && state.current._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Delete
      .addCase(deleteAnnouncement.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.current && state.current._id === action.payload) {
          state.current = null;
        }
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

export default announcementSlice.reducer;
