import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: false,
};

export const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFailure: (state) => {
      (state.loading = false), (state.error = true);
    },
    logout: () => {
      return initialState;
    },

    subscription: (state, action) => {
      if (state.user?.subscribedUsers?.includes(action.payload)) {
        state.user?.subscribedUsers?.splice(
          state?.currentUser?.subscribedUsers?.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        state.user?.subscribedUsers?.push(action.payload);
      }
    },
    updateUserSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginFailure,
  loginSuccess,
  logout,
  subscription,
  subscribedChannels,
  updateUserSuccess
} = UserSlice.actions;

export default UserSlice.reducer;
