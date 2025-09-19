'use client';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/store/apps/user/UserSlice';

const LeadFormDialog = ({
  open,
  title,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onSubmitText,
  loading,
  loadingComponent,
  isEdit = false,
  onDelete,
  handleInputChange
}) => {
  const personMetOptions = ['CEO', 'Front Office', 'Property Manager', 'Other'];
  const statusOptions = ['New', 'Contacted', 'Interested', 'Qualified', 'Not Interested', 'Converted'];
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.userReducer);
  
    useEffect(() => {
      dispatch(fetchUsers(baseUrl));
    }, [dispatch, baseUrl]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
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
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
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
          <Autocomplete
          size="small"
          options={users || []}
          getOptionLabel={(option) => option.username || ""}
          value={users.find((u) => u.username === formData.lead_initiator) || null}
          onChange={(event, newValue) =>
            handleInputChange({
              target: { name: "lead_initiator", value: newValue ? newValue.username : "" }
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              label="Lead Initiator"
              error={!!formErrors.lead_initiator}
              helperText={formErrors.lead_initiator}
              fullWidth
            />
          )}
          sx={{ mt: 2, mb: 1 }}
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
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
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
        <Button onClick={onClose}>Cancel</Button>
        {isEdit && (
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={loading}
          sx={{ minWidth: 120, minHeight: 40 }}
        >
          {loading ? loadingComponent : onSubmitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadFormDialog;