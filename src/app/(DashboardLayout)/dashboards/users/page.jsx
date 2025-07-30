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
import toast from 'react-hot-toast';
import { createUser, deleteUser, fetchUsers, updateUser } from '@/store/apps/user/UserSlice';

const getRoleChip = (role) => {
  if (!role) return null;

  const roleLower = role.toLowerCase();
  let color;
  
  switch (roleLower) {
    case 'admin':
      color = 'error';
      break;
    case 'staff':
      color = 'info';
      break;
    case 'manager':
      color = 'warning';
      break;
    default:
      color = 'default';
  }
  
  return <Chip label={role} color={color} size="small" sx={{ fontWeight: 600 }} />;
};

const UsersPage = () => {
  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Users' },
  ];
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { users, status } = useSelector(state => state.userReducer);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    mobile_number: '',
    role: 'Staff'
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

  const usersPerPage = 20;

  useEffect(() => {
    dispatch(fetchUsers(baseUrl));
  }, [dispatch, baseUrl]);

  const validateForm = () => {
    const errors = {};
    if (!formData.username) {
      errors.username = 'Full name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile_number?.includes(searchTerm)) &&
      (roleFilter === 'all' || user.role === roleFilter)
  );

  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({
      username: '',
      email: '',
      mobile_no: '',
      role: 'Staff'
    });
    setFormErrors({});
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      mobile_no: user.mobile_no || '',
      role: user.role || 'Staff'
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
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

  const handleCreateUser = async () => {    
    if (!validateForm()) return;
    
    try {
      const result = await toast.promise(
        dispatch(createUser({ baseUrl, ...formData })).unwrap(),
        {
          loading: 'Creating user...',
          success: (data) => data.message || 'User created successfully!',
          error: (err) => err.message || 'Failed to create user'
        }
      );
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const result = await toast.promise(
        dispatch(updateUser({ 
          baseUrl, 
          name: selectedUser.email,
          ...formData 
        })).unwrap(),
        {
          loading: 'Updating user...',
          success: 'User updated successfully!',
          error: 'Failed to update user'
        }
      );
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const result = await toast.promise(
        dispatch(deleteUser({ baseUrl, name: selectedUser.email })).unwrap(),
        {
          loading: 'Deleting user...',
          success: (data) => data.message || 'User deleted successfully!',
          error: (err) => err.message || 'Failed to delete user'
        }
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Options for dropdowns
  const roleOptions = ['Admin', 'Staff', 'Manager'];

  return (
    <Box p={3}>
      <Breadcrumb title="Users" items={BCrumb} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search by name, email or phone..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Role"
            >
              <MenuItem value="all">All Roles</MenuItem>
              {roleOptions.map((option) => (
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
          Add New User
        </Button>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>No</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Mobile Number</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === 'loading' && !users.length ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <WaveLoading />
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => (
                <TableRow key={user.email}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile_no}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenEditDialog(user)}
                    >
                      <LaunchIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {paginatedUsers.length === 0 && status !== 'loading' && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
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

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField 
              label="User Name*" 
              fullWidth 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              required
            />
            <TextField 
              label="Email *" 
              fullWidth 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />
            <TextField 
              label="Mobile Number" 
              fullWidth 
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateUser}
            disabled={status === 'loading'}
            sx={{ minWidth: 120, minHeight: 40 }}
          >
            {status === 'loading' ? <WaveLoading /> : 'Save User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField 
              label="User Name *" 
              fullWidth 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              required
            />
            <TextField 
              label="Email *" 
              fullWidth 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              InputProps={{ readOnly: true }} // Email is used as identifier so shouldn't be changed
              required
            />
            <TextField 
              label="Mobile Number" 
              fullWidth 
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Close</Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => handleOpenDeleteDialog(selectedUser)}
            disabled={status === 'loading'}
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateUser}
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
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteUser}
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

export default UsersPage;