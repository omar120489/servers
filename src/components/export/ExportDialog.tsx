import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

export interface ExportField {
  id: string;
  label: string;
}

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  data: any[];
  fields: ExportField[];
  filename?: string;
  title?: string;
}

export default function ExportDialog({
  open,
  onClose,
  data,
  fields,
  filename = 'export',
  title = 'Export Data',
}: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map((f) => f.id));

  const handleToggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(fields.map((f) => f.id));
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      return;
    }

    // Prepare export data with only selected fields
    const exportData = data.map((row) => {
      const exportRow: any = {};
      selectedFields.forEach((fieldId) => {
        const field = fields.find((f) => f.id === fieldId);
        if (field) {
          exportRow[field.label] = row[fieldId] ?? '';
        }
      });
      return exportRow;
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${timestamp}`;

    if (format === 'xlsx') {
      // Export as Excel
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Export');
      XLSX.writeFile(wb, `${fullFilename}.xlsx`);
    } else {
      // Export as CSV
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fullFilename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Export Format</InputLabel>
            <Select
              value={format}
              label="Export Format"
              onChange={(e) => setFormat(e.target.value as 'csv' | 'xlsx')}
            >
              <MenuItem value="xlsx">
                <Stack direction="row" spacing={1} alignItems="center">
                  <FileDownloadIcon fontSize="small" />
                  <span>Excel (XLSX)</span>
                </Stack>
              </MenuItem>
              <MenuItem value="csv">
                <Stack direction="row" spacing={1} alignItems="center">
                  <FileDownloadIcon fontSize="small" />
                  <span>CSV</span>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>

          <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2">Fields to Export</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Select All" size="small" onClick={handleSelectAll} />
                <Chip label="Deselect All" size="small" onClick={handleDeselectAll} />
              </Stack>
            </Stack>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {selectedFields.length} of {fields.length} fields selected
            </Typography>
            <FormGroup sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
              {fields.map((field) => (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Checkbox
                      checked={selectedFields.includes(field.id)}
                      onChange={() => handleToggleField(field.id)}
                      size="small"
                    />
                  }
                  label={field.label}
                />
              ))}
            </FormGroup>
          </div>

          <Typography variant="caption" color="text.secondary">
            Exporting {data.length} record{data.length !== 1 ? 's' : ''} in {format.toUpperCase()}{' '}
            format
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleExport}
          startIcon={<FileDownloadIcon />}
          disabled={selectedFields.length === 0}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}

