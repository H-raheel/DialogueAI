// store/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user:null,
  role:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   addUser(state,action){
    state.user=action.payload.user;
    state.role=action.payload.role;
   },
   removeUser(state){
    state.user=null;
    state.role=null;

   }
  },
});

export const { addUser,removeUser } = authSlice.actions;

export default authSlice.reducer;
