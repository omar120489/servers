import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PaletteIcon from '@mui/icons-material/Palette';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function Settings() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [pipelineStages, setPipelineStages] = useState([
    'Prospecting',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
  ]);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Workspace Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Workspace Settings
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Workspace Name"
                  fullWidth
                  defaultValue="Traffic CRM"
                />
                <TextField
                  label="Company Website"
                  fullWidth
                  defaultValue="https://trafficcrm.com"
                />
                <FormControl fullWidth>
                  <InputLabel>Default Timezone</InputLabel>
                  <Select defaultValue="utc-5" label="Default Timezone">
                    <MenuItem value="utc-8">Pacific Time (UTC-8)</MenuItem>
                    <MenuItem value="utc-5">Eastern Time (UTC-5)</MenuItem>
                    <MenuItem value="utc+0">UTC</MenuItem>
                    <MenuItem value="utc+1">Central European Time (UTC+1)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select defaultValue="usd" label="Currency">
                    <MenuItem value="usd">USD ($)</MenuItem>
                    <MenuItem value="eur">EUR (€)</MenuItem>
                    <MenuItem value="gbp">GBP (£)</MenuItem>
                    <MenuItem value="jpy">JPY (¥)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select defaultValue="mdy" label="Date Format">
                    <MenuItem value="mdy">MM/DD/YYYY</MenuItem>
                    <MenuItem value="dmy">DD/MM/YYYY</MenuItem>
                    <MenuItem value="ymd">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <EmailIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Email Settings
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="From Name"
                  fullWidth
                  defaultValue="Traffic CRM"
                />
                <TextField
                  label="From Email"
                  fullWidth
                  defaultValue="noreply@trafficcrm.com"
                  type="email"
                />
                <TextField
                  label="Reply-To Email"
                  fullWidth
                  defaultValue="support@trafficcrm.com"
                  type="email"
                />
                <Divider />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send welcome email to new users"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send daily digest emails"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Send marketing emails"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Pipeline Stages */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PaletteIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Pipeline Stages
                  </Typography>
                </Stack>
                <Button startIcon={<AddIcon />} size="small">
                  Add Stage
                </Button>
              </Stack>

              <List>
                {pipelineStages.map((stage, index) => (
                  <ListItem key={index} divider={index < pipelineStages.length - 1}>
                    <ListItemText
                      primary={stage}
                      secondary={`Position ${index + 1}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Integrations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <IntegrationInstructionsIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Integrations
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Slack
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Get notifications in Slack
                      </Typography>
                    </Box>
                    <Chip label="Connected" color="success" size="small" />
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Google Calendar
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sync your meetings
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined">
                      Connect
                    </Button>
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Zapier
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automate workflows
                      </Typography>
                    </Box>
                    <Chip label="Connected" color="success" size="small" />
                  </Stack>
                </Paper>

                <Button variant="outlined" fullWidth>
                  View All Integrations
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Security
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Require two-factor authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enforce strong passwords"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Allow API access"
                />
                <Divider />
                <TextField
                  label="Session Timeout (minutes)"
                  type="number"
                  fullWidth
                  defaultValue="60"
                />
                <Button variant="outlined" fullWidth>
                  View Active Sessions
                </Button>
                <Button variant="outlined" color="error" fullWidth>
                  Revoke All Sessions
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <StorageIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Data Management
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Storage Used
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    2.4 GB / 10 GB
                  </Typography>
                </Paper>

                <Button variant="outlined" fullWidth startIcon={<SaveIcon />}>
                  Export All Data
                </Button>
                <Button variant="outlined" fullWidth>
                  Import Data
                </Button>
                <Divider />
                <FormControl fullWidth>
                  <InputLabel>Data Retention</InputLabel>
                  <Select defaultValue="forever" label="Data Retention">
                    <MenuItem value="forever">Keep Forever</MenuItem>
                    <MenuItem value="1year">1 Year</MenuItem>
                    <MenuItem value="2years">2 Years</MenuItem>
                    <MenuItem value="5years">5 Years</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" color="error" fullWidth>
                  Delete All Data
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save All Settings
        </Button>
      </Box>
    </Box>
  );
}
