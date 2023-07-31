import axios, { AxiosError } from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

interface IAuthState {
  loading: boolean;
  userInfo: IUserInfo | null;
  userToken: string | null;
  error: object | null;
  success: boolean;
}

const initialState = {
  loading: false,
  userInfo: null,
  userToken: null,
  error: null,
  success: false,
} as IAuthState;

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, firstName, lastName, password }: IUserInfo, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', { email, firstName, lastName, password });
      return response.data as IUserInfo;
    } catch (error) {
      const _error = error as AxiosError;
      if (!_error.response) {
        throw _error;
      }
      return rejectWithValue(_error.response.data);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.userInfo = payload as IUserInfo;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as AxiosError;
    });
  },
});

export default authSlice.reducer;
