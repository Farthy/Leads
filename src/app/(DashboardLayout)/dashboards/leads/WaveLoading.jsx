'use client';
import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

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

export default WaveLoading;