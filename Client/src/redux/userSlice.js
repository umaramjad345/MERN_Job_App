import { createSlice } from "@reduxjs/toolkit";
import { users } from "../utils/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("userInfo")) ?? null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export default userSlice.reducer;

export function Login(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login({ user }));
  };
}

export function Logout(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}
