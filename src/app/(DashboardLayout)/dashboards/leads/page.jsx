'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import { createLead, deleteLead, fetchLeads, updateLead } from '@/store/apps/leads/LeadSlice';
import toast from 'react-hot-toast';

const getStatusChip = (status) => {
  if (!status) return null;

  const statusLower = status.toLowerCase();
  let color;
  
  switch (statusLower) {
    case 'new':
      color = 'info';
      break;
    case 'contacted':
      color = 'warning';
      break;
    case 'interested':
    case 'qualified':
    case 'converted':
      color = 'success';
      break;
    case 'not interested':
      color = 'error';
      break;
    default:
      color = 'default';
  }
  
  return <Chip label={status} color={color} size="small" sx={{ fontWeight: 600 }} />;
};

const LeadsPage = () => {
  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Leads' },
  ];
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { leads, status } = useSelector(state => state.leadsReducer);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    company_name: '',
    person_met: '',
    official_email: '',
    official_safaricom_number: '',
    lead_initiator: '',
    location: '',
    status: 'New',
    remarks: ''
  });

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

  const leadsPerPage = 20;

  useEffect(() => {
   const result =  dispatch(fetchLeads( baseUrl )).unwrap();
  }, [dispatch, baseUrl]);

  const validateForm = () => {
    const errors = {};
    if (!formData.official_safaricom_number) {
      errors.official_safaricom_number = 'Official Safaricom number is required';
    }
    if (!formData.lead_initiator) {
      errors.lead_initiator = 'Lead initiator is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.official_safaricom_number?.includes(searchTerm)) &&
      (statusFilter === 'all' || lead.status === statusFilter)
  );

  const startIndex = (page - 1) * leadsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + leadsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({
      company_name: '',
      person_met: '',
      official_email: '',
      official_safaricom_number: '',
      lead_initiator: '',
      location: '',
      status: 'New',
      remarks: ''
    });
    setFormErrors({});
  };

  const handleOpenEditDialog = (lead) => {
    setSelectedLead(lead);
    setFormData({
      company_name: lead.company_name || '',
      person_met: lead.person_met || '',
      official_email: lead.official_email || '',
      official_safaricom_number: lead.official_safaricom_number || '',
      lead_initiator: lead.lead_initiator || '',
      location: lead.location || '',
      status: lead.status || 'New',
      remarks: lead.remarks || ''
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedLead(null);
  };

  const handleOpenDeleteDialog = (lead) => {
    setSelectedLead(lead);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedLead(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCreateLead = async () => {    
    if (!validateForm()) return;
    
    try {
      const result = await toast.promise(
        dispatch(createLead({ baseUrl, ...formData })).unwrap(),
        {
          loading: 'Creating lead...',
          success: (data) => data.message || 'Lead created successfully!',
          error: (err) => err.message || 'Failed to create lead'
        }
      );
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };
const handleUpdateLead = async () => {
  if (!selectedLead) return;

  try {
    const result = await toast.promise(
      dispatch(updateLead({ 
        baseUrl, 
        name: selectedLead.name, 
        ...formData 
      })).unwrap(),
      {
        loading: 'Updating lead...',
        success: 'Lead updated successfully!',
        error: 'Failed to update lead'
      }
    );
    handleCloseEditDialog();
  } catch (error) {
    console.error('Error updating lead:', error);
  }
};


  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    
    try {
      const result = await toast.promise(
        dispatch(deleteLead({ baseUrl, name: selectedLead.name })).unwrap(),
        {
          loading: 'Deleting lead...',
          success: (data) => data.message || 'Lead deleted successfully!',
          error: (err) => err.message || 'Failed to delete lead'
        }
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Options for dropdowns
  const personMetOptions = ['CEO', 'Front Office', 'Property Manager', 'Other'];
  const statusOptions = ['New', 'Contacted', 'Interested', 'Qualified', 'Not Interested', 'Converted'];

  return (
    <Box p={3}>
      <Breadcrumb title="Leads" items={BCrumb} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search by company or phone..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Lead
        </Button>
      </Box>

      {/* Leads Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>No</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Person Met</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === 'loading' && !leads.length ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <WaveLoading />
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead, index) => (
                <TableRow key={lead.name}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{lead.company_name}</TableCell>
                  <TableCell>{lead.person_met}</TableCell>
                  <TableCell>{lead.official_safaricom_number}</TableCell>
                  <TableCell>{getStatusChip(lead.status)}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenEditDialog(lead)}
                    >
                      <LaunchIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(lead)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {paginatedLeads.length === 0 && status !== 'loading' && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack direction="row" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* Add Lead Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField 
              label="Name of the Company" 
              fullWidth 
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Person Met</InputLabel>
              <Select 
                name="person_met"
                value={formData.person_met}
                onChange={handleInputChange}
                label="Person Met"
                required
              >
                {personMetOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Official Email" 
              fullWidth 
              name="official_email"
              value={formData.official_email}
              onChange={handleInputChange}
            />
            <TextField 
              label="Official Mobile Number *" 
              fullWidth 
              name="official_safaricom_number"
              value={formData.official_safaricom_number}
              onChange={handleInputChange}
              error={!!formErrors.official_safaricom_number}
              helperText={formErrors.official_safaricom_number}
              required
            />
            <TextField 
              label="Lead Initiator *" 
              fullWidth 
              name="lead_initiator"
              value={formData.lead_initiator}
              onChange={handleInputChange}
              error={!!formErrors.lead_initiator}
              helperText={formErrors.lead_initiator}
              required
            />
            <TextField 
              label="Location of the Office" 
              fullWidth 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Remarks"
              fullWidth
              multiline
              rows={3}
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateLead}
            disabled={status === 'loading'}
            sx={{ minWidth: 120, minHeight: 40 }}
          >
            {status === 'loading' ? <WaveLoading /> : 'Save Lead'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField 
              label="Name of the Company" 
              fullWidth 
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Person Met</InputLabel>
              <Select 
                name="person_met"
                value={formData.person_met}
                onChange={handleInputChange}
                label="Person Met"
              >
                {personMetOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Official Email" 
              fullWidth 
              name="official_email"
              value={formData.official_email}
              onChange={handleInputChange}
            />
            <TextField 
              label="Official Mobile Number" 
              fullWidth 
              name="official_safaricom_number"
              value={formData.official_safaricom_number}
              onChange={handleInputChange}
              required
            />
            <TextField 
              label="Lead Initiator" 
              fullWidth 
              name="lead_initiator"
              value={formData.lead_initiator}
              onChange={handleInputChange}
              InputProps={{ readOnly: true }} 
              required
            />
            <TextField 
              label="Location of the Office" 
              fullWidth 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Remarks"
              fullWidth
              multiline
              rows={3}
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Close</Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => handleOpenDeleteDialog(selectedLead)}
            disabled={status === 'loading'}
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateLead}
            disabled={status === 'loading'}
            sx={{ minWidth: 120, minHeight: 40 }}
          >
            {status === 'loading' ? <WaveLoading /> : 'Update Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this lead?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteLead}
            disabled={status === 'loading'}
            sx={{ minWidth: 100, minHeight: 40 }}
          >
            {status === 'loading' ? <WaveLoading /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsPage;