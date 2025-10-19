import React from 'react';
import {
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { SearchBar } from 'components/shared';

interface AuditLogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterAction: string;
  onFilterActionChange: (value: string) => void;
  filterResource: string;
  onFilterResourceChange: (value: string) => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export default function AuditLogFilters({
  search,
  onSearchChange,
  filterAction,
  onFilterActionChange,
  filterResource,
  onFilterResourceChange,
  onExport,
  isExporting,
}: AuditLogFiltersProps) {
  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by user, resource, or details..."
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Action</InputLabel>
          <Select
            value={filterAction}
            label="Action"
            onChange={(e) => onFilterActionChange(e.target.value)}
          >
            <MenuItem value="all">All Actions</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="updated">Updated</MenuItem>
            <MenuItem value="deleted">Deleted</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Resource</InputLabel>
          <Select
            value={filterResource}
            label="Resource"
            onChange={(e) => onFilterResourceChange(e.target.value)}
          >
            <MenuItem value="all">All Resources</MenuItem>
            <MenuItem value="contact">Contacts</MenuItem>
            <MenuItem value="company">Companies</MenuItem>
            <MenuItem value="deal">Deals</MenuItem>
            <MenuItem value="user">Users</MenuItem>
            <MenuItem value="settings">Settings</MenuItem>
          </Select>
        </FormControl>

        {onExport && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExport}
            disabled={isExporting}
            sx={{ minWidth: 120 }}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

