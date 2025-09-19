import { Chip } from '@mui/material';

export const getStatusChip = (status) => {
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