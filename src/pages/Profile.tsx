import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Profile Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Box position="relative">
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'primary.main',
                      fontSize: '3rem',
                    }}
                  >
                    DU
                  </Avatar>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                    }}
                  >
                    <CameraAltIcon fontSize="small" />
                  </Button>
                </Box>

                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    Demo User
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    demo@example.com
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Admin
                  </Typography>
                </Box>

                <Divider sx={{ width: '100%' }} />

                <Stack spacing={2} width="100%">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      January 15, 2024
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      Today at 2:30 PM
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Deals
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      23 Active
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Personal Information
                  </Typography>
                  {!editMode ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button onClick={() => setEditMode(false)}>Cancel</Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </Stack>
                  )}
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue="Demo"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue="User"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue="demo@example.com"
                      disabled={!editMode}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      defaultValue="+1 (555) 123-4567"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      defaultValue="Sales Manager"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      defaultValue="Experienced sales professional with a passion for building relationships."
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                  <LanguageIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Preferences
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select defaultValue="en" label="Language">
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select defaultValue="utc-5" label="Timezone">
                      <MenuItem value="utc-8">Pacific Time (UTC-8)</MenuItem>
                      <MenuItem value="utc-5">Eastern Time (UTC-5)</MenuItem>
                      <MenuItem value="utc+0">UTC</MenuItem>
                      <MenuItem value="utc+1">Central European Time (UTC+1)</MenuItem>
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

            {/* Notifications */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Notifications
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email notifications for new deals"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email notifications for deal updates"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Email notifications for new contacts"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Push notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Weekly activity summary"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Security
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Button variant="outlined" fullWidth>
                    Change Password
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outlined" fullWidth color="error">
                    View Active Sessions
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

