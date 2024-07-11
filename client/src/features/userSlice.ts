import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../app/services/authApi";
import { User } from "../app/types";
import { RootState } from "../app/store";

interface InitialState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
        },
      )
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      });
  },
});

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectUser = (state: RootState) => state.user.user;
