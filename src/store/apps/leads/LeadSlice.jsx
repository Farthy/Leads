import { getAuthHeaders } from '@/utils/authorization';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (baseUrl, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/method/kejapaycrm.services.rest.fetch_all_leads`,
      //    {
      //   headers: getAuthHeaders(),
      // }
    );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leads');
    }
  },
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async ({ baseUrl, company_name, location, person_met, official_email, official_safaricom_number, lead_initiator, status, remarks }, { rejectWithValue , dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.rest.create_lead`,
        {
          company_name,
          location,
          person_met,
          official_email,
          official_safaricom_number,
          lead_initiator,
          status,
          remarks
        },
        // { headers: getAuthHeaders() },
      );
      dispatch(fetchLeads(baseUrl))
      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create lead');
    }
  },
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ baseUrl, name, ...updateData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.rest.update_lead`,
        {
          name,
          ...updateData
        },
        // { headers: getAuthHeaders() },
      );

      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }
       dispatch(fetchLeads(baseUrl))
      return { name, ...response.data.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update lead');
    }
  },
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async ({ baseUrl, name }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/method/kejapaycrm.services.rest.delete_lead`,
        { name },
        // { headers: getAuthHeaders() },
      );

      if (response.status !== 200) {
        return rejectWithValue(`Failed with status: ${response.status}`);
      }
      dispatch(fetchLeads(baseUrl))
      return name;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete lead');
    }
  },
);

const initialState = {
  leads: [],
  status: 'idle',
  error: null,
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads.unshift(action.payload.message);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedLead = action.payload;
        state.leads = state.leads.map(lead =>
          lead.name === updatedLead.name ? { ...lead, ...updatedLead } : lead
        );
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = state.leads.filter(lead => lead.name !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export default leadsSlice.reducer;