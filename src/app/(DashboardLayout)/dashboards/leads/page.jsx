'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import {
  Box,
  TableContainer,
  Paper,
  Pagination,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { createLead, deleteLead, fetchLeads, updateLead } from '@/store/apps/leads/LeadSlice';
import toast from 'react-hot-toast';
import LeadsTable from './LeadsTable';
import LeadFormDialog from './LeadFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import SearchAndFilterBar from './SearchAndFilterBar';
import WaveLoading from './WaveLoading';

const LeadsPage = () => {
  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Leads' }];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { leads, status } = useSelector((state) => state.leadsReducer);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [userFilter, setUserFilter] = useState('all');

  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    company_name: '',
    person_met: '',
    official_email: '',
    official_safaricom_number: '',
    lead_initiator: '',
    location: '',
    status: 'New',
    remarks: '',
  });

  const leadsPerPage = 20;

  useEffect(() => {
    dispatch(fetchLeads(baseUrl)).unwrap();
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
      (statusFilter === 'all' || lead.status === statusFilter) &&
      (userFilter === 'all' || lead.lead_initiator?.toLowerCase() === userFilter.toLowerCase()),
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
      remarks: '',
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
      remarks: lead.remarks || '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCreateLead = async () => {
    if (!validateForm()) return;

    try {
      const result = await toast.promise(dispatch(createLead({ baseUrl, ...formData })).unwrap(), {
        loading: 'Creating lead...',
        success: (data) => data.message || 'Lead created successfully!',
        error: (err) => err.message || 'Failed to create lead',
      });
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;

    try {
      const result = await toast.promise(
        dispatch(
          updateLead({
            baseUrl,
            name: selectedLead.name,
            ...formData,
          }),
        ).unwrap(),
        {
          loading: 'Updating lead...',
          success: 'Lead updated successfully!',
          error: 'Failed to update lead',
        },
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
          error: (err) => err.message || 'Failed to delete lead',
        },
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  return (
    <Box p={3}>
      <Breadcrumb title="Leads" items={BCrumb} />

      <SearchAndFilterBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        userFilter={userFilter}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onFilterChange={(e) => setStatusFilter(e.target.value)}
        onUserFilterChange={(value) => setUserFilter(value)}
        onAddClick={handleOpenAddDialog}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>No</strong>
              </TableCell>
              <TableCell>
                <strong>Company</strong>
              </TableCell>
              <TableCell>
                <strong>Person Met</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Initiator</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <LeadsTable
              leads={paginatedLeads}
              startIndex={startIndex}
              status={status}
              loadingComponent={<WaveLoading />}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
            />
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      <LeadFormDialog
        open={openAddDialog}
        title="Add New Lead"
        formData={formData}
        formErrors={formErrors}
        onClose={handleCloseAddDialog}
        onSubmit={handleCreateLead}
        onSubmitText="Save Lead"
        loading={status === 'loading'}
        loadingComponent={<WaveLoading />}
        handleInputChange={handleInputChange}
      />

      <LeadFormDialog
        open={openEditDialog}
        title="Edit Lead"
        formData={formData}
        formErrors={formErrors}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateLead}
        onSubmitText="Update Changes"
        loading={status === 'loading'}
        loadingComponent={<WaveLoading />}
        isEdit={true}
        onDelete={() => handleOpenDeleteDialog(selectedLead)}
        handleInputChange={handleInputChange}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteLead}
        loading={status === 'loading'}
        loadingComponent={<WaveLoading />}
      />
    </Box>
  );
};

export default LeadsPage;