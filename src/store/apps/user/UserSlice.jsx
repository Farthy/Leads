import { getAuthHeaders } from '@/utils/authorization';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (baseUrl, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/method/kejapaycrm.services.user.get_all_users`,
        // { headers: getAuthHeaders() },
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  },
);
export const createUser = createAsyncThunk(
  'users/createUser',
  async ({ baseUrl, username, email, mobile_no }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.user.create_user`,
        {
          first_name: username,
          email,
          mobile_number: mobile_no,
        },
        // { headers: getAuthHeaders() },
      );

      dispatch(fetchUsers(baseUrl));

      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }

      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  },
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ baseUrl, name, ...updateData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.user.update_user`,
        {
          name,
          ...updateData
        },
        // { headers: getAuthHeaders() },
      );

      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }
      dispatch(fetchUsers(baseUrl));

      return { name, ...response.data.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  },
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async ({ baseUrl, name }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.user.delete_user`,
        { email: name },
        // { headers: getAuthHeaders() },
      );

      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }

      dispatch(fetchUsers(baseUrl));

      return name;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  },
);
export const ForgotPassword = createAsyncThunk(
  'user/ForgotPassword',
  async ({ baseUrl, mobile_number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.user.send_reset_password_otp`,
        {
          mobile_number,
        },
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payment entries');
    }
  },
);

export const ResetPassword = createAsyncThunk(
  'user/ResetPassword',
  async ({ baseUrl, mobile_number, otp, new_password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.user.reset_password`,
        {
          mobile_number,
          otp,
          new_password,
        },
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payment entries');
    }
  },
);
export const LoginUser = createAsyncThunk(
  'user/LoginUser',
  async ({ baseUrl, mobile, pwd }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/method/kejapaycrm.services.user.login`, {
        mobile,
        pwd,
      });      
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to login');
    }
  },
);
const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.unshift(action.payload); // add new user at top
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedUser = action.payload;
        state.users = state.users.map(user =>
          user.name === updatedUser.name ? { ...user, ...updatedUser } : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.name !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
