/**
 * LeadsBulkActions Component
 * 
 * Bulk action menu for selected leads.
 * Extracted from Leads page to reduce complexity.
 */

import React from 'react';
import {
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

interface LeadsBulkActionsProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}

export default function LeadsBulkActions({
  anchorEl,
  onClose,
  onStatusChange,
  onDelete,
}: LeadsBulkActionsProps) {
  const handleStatusChange = (status: string) => {
    onStatusChange(status);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={() => handleStatusChange('contacted')}>
        <ListItemIcon>
          <CheckCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Mark as Contacted</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleStatusChange('qualified')}>
        <ListItemIcon>
          <CheckCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Mark as Qualified</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete Selected</ListItemText>
      </MenuItem>
    </Menu>
  );
}

