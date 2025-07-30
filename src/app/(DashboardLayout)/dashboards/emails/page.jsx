'use client';

import { fetchEmails } from '@/store/apps/marketing/MarketingSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Pagination } from '@mui/material';
import { motion } from 'framer-motion';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';

const EmailPage = () => {
  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Marketing Emails' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { emails, status } = useSelector((state) => state.marketingReducer);  
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const emailsPerPage = 20;

  // ✅ Wave loading animation
  const WaveLoading = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
      <motion.div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 24,
              backgroundColor: '#1976d2',
              borderRadius: 4,
            }}
            animate={{
              height: [24, 40, 24],
              transition: {
                duration: 1.2,
                repeat: Infinity,
                repeatType: 'loop',
                delay: i * 0.2,
              },
            }}
          />
        ))}
      </motion.div>
    </Box>
  );

  // ✅ Fetch emails on mount
  useEffect(() => {
    dispatch(fetchEmails(baseUrl));
  }, [dispatch, baseUrl]);

  // ✅ Filter emails by company name or recipient
  const filteredEmails = emails.filter((email) =>
    email.lead?.toLowerCase().includes(filterText.toLowerCase()) ||
    email.recipient?.toLowerCase().includes(filterText.toLowerCase())
  );

  // ✅ Pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

  return (
    <div>
      <Breadcrumb title="Marketing Emails" items={BCrumb} />

      {/* ✅ Filter */}
      <Box sx={{ mb: 2, display: 'flex' }}>
        <TextField
          label="Filter by Recipient or Company"
          variant="outlined"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Box>

      {/* ✅ Loading Animation */}
      {status === 'loading' ? (
        <WaveLoading />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>NO</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Recipient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentEmails.map((email, index) => (
                <TableRow key={email.name}>
                  <TableCell>{indexOfFirstEmail + index + 1}</TableCell>
                  <TableCell>{email.lead || '-'}</TableCell>
                  <TableCell>{email.recipient}</TableCell>
                  <TableCell>{email.message}</TableCell>
                  <TableCell>{email.status}</TableCell>
                </TableRow>
              ))}

              {/* ✅ No data row */}
              {currentEmails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No emails found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✅ Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default EmailPage;
