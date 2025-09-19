'use client';
import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/store/apps/user/UserSlice';

const SearchAndFilterBar = ({
  searchTerm,
  statusFilter,
  userFilter,
  onSearchChange,
  onFilterChange,
  onUserFilterChange,
  onAddClick
}) => {
  const statusOptions = ['New', 'Contacted', 'Interested', 'Qualified', 'Not Interested', 'Converted'];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.userReducer);

  useEffect(() => {
    dispatch(fetchUsers(baseUrl));
  }, [dispatch, baseUrl]);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
      <Box display="flex" gap={2} alignItems="center">
        {/* Search by text */}
        <TextField
          variant="outlined"
          placeholder="Search by company or phone..."
          size="small"
          value={searchTerm}
          onChange={onSearchChange}
          sx={{ width: 250 }}
        />

        {/* Status filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={onFilterChange}
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

        {/* User filter (autocomplete) */}
        <Autocomplete
          size="small"
          options={users || []}
          getOptionLabel={(option) => option.username || ""}
          value={users.find((u) => u.username === userFilter) || null}
          onChange={(event, newValue) =>
            onUserFilterChange(newValue ? newValue.username : "all")
          }
          renderInput={(params) => (
            <TextField {...params} label="User" placeholder="Filter by user" />
          )}
          sx={{ width: 180 }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
      >
        Add New Lead
      </Button>
    </Box>
  );
};

export default SearchAndFilterBar;
