// store/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user:null,
  role:null,
  language:"English",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   addUser(state,action){
    state.user=action.payload.user;
    state.role=action.payload.role;
    state.language=action.payload.language;
   },
   removeUser(state){
    state.user=null;
    state.role=null;
    state.language="English";

   }
  },
});

export const { addUser,removeUser } = authSlice.actions;

export default authSlice.reducer;
