import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      // console.log("action ->", action);
      state.userData = action.payload.data;
      state.isAuthenticated =true;
    },
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
  