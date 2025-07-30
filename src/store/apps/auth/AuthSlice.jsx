import { getAuthHeaders } from '@/utils/authorization';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ baseUrl, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapay.services.utils.reset_user_password_otp`,
        { id: email },
      );
      return response.data.message;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const ValidateResetPassword = createAsyncThunk(
  'auth/ValidateResetPassword',
  async ({ baseUrl, email, new_password, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapay.services.utils.validate_user_password_otp`,
        { email, new_password, otp },
      );
      return response.data.message;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ baseUrl, email, old_password, new_password, mobile }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapay.services.password.reset_password`,
        { email, old_password, new_password, mobile },
      );
      return response.data.message;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  },
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isOtpSent: false,
    isOtpValid: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isOtpSent = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.isOtpSent = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
