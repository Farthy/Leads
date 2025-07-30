import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk(
  'marketing/fetchMessages',
  async (baseUrl, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/method/kejapaycrm.services.rest.get_message_status`
      );
      return response.data.message.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

export const fetchEmails = createAsyncThunk(
  'marketing/fetchEmails',
  async (baseUrl, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/method/kejapaycrm.services.rest.get_email_message_logs`
      );
      return response.data.message.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emails');
    }
  }
);

export const sendMarketingNotifications = createAsyncThunk(
  'marketing/sendMarketingNotifications',
  async ({ baseUrl, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.promotions.send_notifications`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to send notifications');
    }
  }
);

const initialState = {
  messages: [],  
  emails: [],  
  status: 'idle',
  error: null,
};

const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchEmails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emails = action.payload;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(sendMarketingNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMarketingNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.unshift(action.payload);
        state.emails.unshift(action.payload);
      })
      .addCase(sendMarketingNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default marketingSlice.reducer;
