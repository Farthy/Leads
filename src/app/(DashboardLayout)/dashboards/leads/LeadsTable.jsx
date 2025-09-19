'use client';
import React from 'react';
import {
  TableCell,
  TableRow,
  IconButton,
  Chip, Stack
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { getStatusChip } from '@/utils/statusUtils';
const LeadsTable = ({ leads, startIndex, status, loadingComponent, onEdit }) => {
  if (status === 'loading' && !leads.length) {
    return (
      <TableRow>
        <TableCell colSpan={6} align="center">
          {loadingComponent}
        </TableCell>
      </TableRow>
    );
  }

  if (leads.length === 0 && status !== 'loading') {
    return (
      <TableRow>
        <TableCell colSpan={6} align="center">
          No leads found.
        </TableCell>
      </TableRow>
    );
  }
  return leads.map((lead, index) => (
    <TableRow key={lead.name}>
      <TableCell>{startIndex + index + 1}</TableCell>
      <TableCell>{lead.company_name}</TableCell>
      <TableCell>{lead.person_met}</TableCell>
      <TableCell>{lead.official_safaricom_number}</TableCell>
      <TableCell>{lead.lead_initiator}</TableCell>
      <TableCell>{getStatusChip(lead.status)}</TableCell>
     <TableCell>
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton color="primary" onClick={() => onEdit(lead)}>
        <LaunchIcon />
      </IconButton>
      {lead.modified_since && (
        <Chip
          label={lead.modified_since}
          size="small"
          color="secondary"
          variant="outlined"
        />
      )}
    </Stack>
  </TableCell>
    </TableRow>
  ));
};

export default LeadsTable;