import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';
import store from '../../store';
import { stat } from 'fs';

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
  error: string | null;
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
      // Password isn't returned with the user info
      console.log(JSON.stringify(response.data));
      return response.data as IUserInfo;
    } catch (error) {
      return rejectWithValue(error);
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
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default authSlice.reducer;
