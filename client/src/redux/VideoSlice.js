import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  video: null,
  loading: false,
  error: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.video = action.payload;
    },
    fetchFailure: (state) => {
      (state.loading = false), (state.error = true);
    },
    like: (state, action) => {
      if (!state.video.likes.includes(action.payload)) {
        state.video.likes.push(action.payload);
        state.video.dislikes.splice(
          state.video.dislikes.findIndex((userId) => userId === action.payload),
          1
        );
      }
    },

    disLike: (state, action) => {
      if (!state.video.dislikes.includes(action.payload)) {
        state.video.dislikes.push(action.payload);
        state.video.likes.splice(
          state.video.likes.findIndex((userId) => userId === action.payload),
          1
        );
      }
    },
  },
});

export const { fetchStart, fetchFailure, fetchSuccess, like, disLike } =
  videoSlice.actions;

export default videoSlice.reducer;
