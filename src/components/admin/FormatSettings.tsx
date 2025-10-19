import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface FormatSettingsType {
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: string;
  timezone: string;
}

interface FormatSettingsProps {
  formats: FormatSettingsType;
  onChange: (formats: FormatSettingsType) => void;
}

export default function FormatSettings({ formats, onChange }: FormatSettingsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Format Settings
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Date Format</InputLabel>
            <Select
              value={formats.dateFormat}
              label="Date Format"
              onChange={(e) => onChange({ ...formats, dateFormat: e.target.value })}
            >
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</MenuItem>
              <MenuItem value="MMM DD, YYYY">MMM DD, YYYY (Dec 31, 2024)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Time Format</InputLabel>
            <Select
              value={formats.timeFormat}
              label="Time Format"
              onChange={(e) => onChange({ ...formats, timeFormat: e.target.value })}
            >
              <MenuItem value="12h">12-hour (3:30 PM)</MenuItem>
              <MenuItem value="24h">24-hour (15:30)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Currency</InputLabel>
            <Select
              value={formats.currency}
              label="Currency"
              onChange={(e) => onChange({ ...formats, currency: e.target.value })}
            >
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="JPY">JPY (¥)</MenuItem>
              <MenuItem value="CAD">CAD (C$)</MenuItem>
              <MenuItem value="AUD">AUD (A$)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Number Format</InputLabel>
            <Select
              value={formats.numberFormat}
              label="Number Format"
              onChange={(e) => onChange({ ...formats, numberFormat: e.target.value })}
            >
              <MenuItem value="en-US">1,234.56 (US)</MenuItem>
              <MenuItem value="de-DE">1.234,56 (German)</MenuItem>
              <MenuItem value="fr-FR">1 234,56 (French)</MenuItem>
              <MenuItem value="en-IN">1,23,456.78 (Indian)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Timezone</InputLabel>
            <Select
              value={formats.timezone}
              label="Timezone"
              onChange={(e) => onChange({ ...formats, timezone: e.target.value })}
            >
              <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
              <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
              <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
              <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
              <MenuItem value="Europe/London">London (GMT)</MenuItem>
              <MenuItem value="Europe/Paris">Paris (CET)</MenuItem>
              <MenuItem value="Asia/Tokyo">Tokyo (JST)</MenuItem>
              <MenuItem value="Asia/Shanghai">Shanghai (CST)</MenuItem>
              <MenuItem value="Asia/Dubai">Dubai (GST)</MenuItem>
              <MenuItem value="Australia/Sydney">Sydney (AEDT)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}

