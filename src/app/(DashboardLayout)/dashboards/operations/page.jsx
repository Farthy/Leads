'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads } from '@/store/apps/leads/LeadSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendMarketingNotifications } from '@/store/apps/marketing/MarketingSlice';

// Wave loading animation
const WaveLoading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }}>
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 40
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 24,
            backgroundColor: '#1976d2',
            borderRadius: 4
          }}
          animate={{
            height: [24, 40, 24],
            transition: {
              duration: 1.2,
              repeat: Infinity,
              repeatType: 'loop',
              delay: i * 0.2
            }
          }}
        />
      ))}
    </motion.div>
  </Box>
);

const MarketingPage = () => {
  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Operations' },
  ];

  const [message, setMessage] = useState('');
  const [leadFilter, setLeadFilter] = useState('');
 const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [specificLeadsDialogOpen, setSpecificLeadsDialogOpen] = useState(false);
  const [selectedSpecificLeads, setSelectedSpecificLeads] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { leads } = useSelector(state => state.leadsReducer);
  
  useEffect(() => {
    dispatch(fetchLeads(baseUrl)).unwrap();
  }, [dispatch, baseUrl]);


  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleLeadFilterChange = (e) => {
    const value = e.target.value;
    setLeadFilter(value);
    
    // Automatically open dialog when specific leads is selected
    if (value === 'specific') {
      setSpecificLeadsDialogOpen(true);
    }
  };
  const handleDeliveryChange = (event, newSelection) => {
    if (newSelection.length <= 3) {
      setDeliveryOptions(newSelection);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('lead_filter', leadFilter);
      const deliveryMethods = deliveryOptions.map(option => ({
        method: option,
        label: option.charAt(0).toUpperCase() + option.slice(1)
      }));
      formData.append('delivery_methods', JSON.stringify(deliveryMethods));
      if (uploadedFile) {
        formData.append('attachment', uploadedFile);
      }
      if (leadFilter === 'specific' && selectedSpecificLeads.length > 0) {
        const leadIds = selectedSpecificLeads.map(lead => lead.name);
        formData.append('lead_names', JSON.stringify(leadIds));
      }
      await toast.promise(
        dispatch(sendMarketingNotifications({ baseUrl, formData })).unwrap(),
        {
          pending: 'Sending messages...',
          success: 'Messages sent successfully!',
          error: (err) => err || 'Failed to send messages'
        }
      );
      setMessage('');
      setUploadedFile(null);
      setSelectedSpecificLeads([]);
      setDeliveryOptions([]);
      setLeadFilter('');

    } catch (error) {
      console.error('Error sending messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = message.trim() === '' || deliveryOptions.length === 0 || 
    (leadFilter === 'specific' && selectedSpecificLeads.length === 0);

  return (
    <Box p={3}>
      <Breadcrumb title="Marketing Operations" items={BCrumb} />

      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Send Marketing Message
        </Typography>

        {/* Message Field */}
        <TextField
          label="Write your message"
          multiline
          rows={6}
          fullWidth
          required
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* File Upload */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            {uploadedFile ? uploadedFile.name : 'Upload File (PDF, Images)'}
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="lead-filter-label">Lead Category</InputLabel>
            <Select
              labelId="lead-filter-label"
              value={leadFilter}
              onChange={handleLeadFilterChange}
              label="Lead Category"
            >
              <MenuItem value="specific">Specific Leads</MenuItem>
              <MenuItem value="all">All Leads</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
            </Select>
          </FormControl>
          {leadFilter === 'specific' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
              {selectedSpecificLeads.length > 0 ? (
                <>
                  {selectedSpecificLeads.map((lead) => (
                    <Chip 
                      key={lead.id} 
                      label={lead.company_name} 
                      onDelete={() => setSelectedSpecificLeads(
                        selectedSpecificLeads.filter(l => l.id !== lead.id)
                      )} 
                    />
                  ))}
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setSpecificLeadsDialogOpen(true)}
                    sx={{ ml: 1 }}
                  >
                    Edit Selection
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No leads selected
                </Typography>
              )}
            </Box>
          )}
      <ToggleButtonGroup
        value={deliveryOptions}
        onChange={handleDeliveryChange}
        aria-label="delivery methods"
        color="primary"
        exclusive={false}
      >
        <ToggleButton value="email" sx={{ px: 3, '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' } }}>
          Email
        </ToggleButton>
        <ToggleButton value="sms" sx={{ px: 3, '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' } }}>
          SMS
        </ToggleButton>
        <ToggleButton value="whatsapp" sx={{ px: 3, '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' } }}>
          WhatsApp
        </ToggleButton>
      </ToggleButtonGroup>

        </Stack>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isSubmitDisabled || loading}
          onClick={handleSubmit}
          sx={{ height: 50, fontSize: 18 }}
        >
          {loading ? <WaveLoading /> : 'Send Message'}
        </Button>
      </Box>
      <Dialog 
        open={specificLeadsDialogOpen} 
        onClose={() => setSpecificLeadsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select Specific Leads</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={leads}
            getOptionLabel={(option) => option.company_name || option.name || ''}
            value={selectedSpecificLeads}
            onChange={(event, newValue) => {
              setSelectedSpecificLeads(newValue);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Leads"
                placeholder="Type to search..."
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.company_name || option.name}
                />
              ))
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSpecificLeadsDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setSpecificLeadsDialogOpen(false);
            }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketingPage;