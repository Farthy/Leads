'use client';

import { fetchMessages } from '@/store/apps/marketing/MarketingSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Pagination } from '@mui/material';
import { motion } from 'framer-motion';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';

const page = () => {
  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Marketing Messages' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const { messages, status } = useSelector((state) => state.marketingReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const smsPerPage = 20;

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

  useEffect(() => {
    dispatch(fetchMessages(baseUrl));
  }, [dispatch, baseUrl]);
  const filteredMessages = messages.filter((msg) =>
    msg.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    msg.mobile_number?.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastMessage = currentPage * smsPerPage;
  const indexOfFirstMessage = indexOfLastMessage - smsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / smsPerPage);

  return (
    <div>
      <Breadcrumb title="Marketing Messages" items={BCrumb} />

      <Box sx={{ mb: 2, display: 'flex' }}>
        <TextField
          label="Filter by Mobile or Company"
          variant="outlined"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1); 
          }}
        />
      </Box>
      {status === 'loading' ? (
  <WaveLoading />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead >
              <TableRow>
                <TableCell sx={{  fontWeight: 'bold' }}>NO</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Mobile Number</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Message</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMessages.map((msg, index) => (
                <TableRow key={msg.name}>
                  <TableCell>{indexOfFirstMessage + index + 1}</TableCell>
                  <TableCell>{msg.company_name || '-'}</TableCell>
                  <TableCell>{msg.mobile_number}</TableCell>
                  <TableCell>{msg.message_sent}</TableCell>
                  <TableCell>{msg.status}</TableCell>
                </TableRow>
              ))}
              {currentMessages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No messages found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✅ Pagination Controls */}
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

export default page;
