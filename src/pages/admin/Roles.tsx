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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

const allPermissions = [
  'View Dashboard',
  'View Contacts',
  'Create Contacts',
  'Edit Contacts',
  'Delete Contacts',
  'View Companies',
  'Create Companies',
  'Edit Companies',
  'Delete Companies',
  'View Deals',
  'Create Deals',
  'Edit Deals',
  'Delete Deals',
  'View Activities',
  'Create Activities',
  'View Reports',
  'Export Data',
  'Manage Users',
  'Manage Roles',
  'Manage Settings',
  'View Audit Log',
];

const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access with all permissions',
    userCount: 2,
    permissions: allPermissions,
    color: '#EA5455',
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Can manage team and view all data',
    userCount: 5,
    permissions: [
      'View Dashboard',
      'View Contacts',
      'Create Contacts',
      'Edit Contacts',
      'View Companies',
      'Create Companies',
      'Edit Companies',
      'View Deals',
      'Create Deals',
      'Edit Deals',
      'View Activities',
      'Create Activities',
      'View Reports',
      'Export Data',
    ],
    color: '#7367F0',
  },
  {
    id: 3,
    name: 'Sales Rep',
    description: 'Can manage own deals and contacts',
    userCount: 15,
    permissions: [
      'View Dashboard',
      'View Contacts',
      'Create Contacts',
      'Edit Contacts',
      'View Companies',
      'View Deals',
      'Create Deals',
      'Edit Deals',
      'View Activities',
      'Create Activities',
    ],
    color: '#00CFE8',
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to data',
    userCount: 8,
    permissions: [
      'View Dashboard',
      'View Contacts',
      'View Companies',
      'View Deals',
      'View Activities',
      'View Reports',
    ],
    color: '#28C76F',
  },
];

export default function Roles() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Roles & Permissions</Typography>
          <Typography variant="body2" color="text.secondary">
            Define roles and manage permissions for your team
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedRole(null);
          setOpenDialog(true);
        }}>
          Create Role
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {mockRoles.map((role) => (
          <Grid item xs={12} md={6} key={role.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {role.name}
                        </Typography>
                        <Chip
                          label={`${role.userCount} users`}
                          size="small"
                          sx={{ bgcolor: role.color, color: 'white' }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleEditRole(role)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {role.name !== 'Admin' && (
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Permissions ({role.permissions.length})
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                      <Stack spacing={0.5}>
                        {role.permissions.slice(0, 8).map((permission, index) => (
                          <Stack key={index} direction="row" spacing={1} alignItems="center">
                            <CheckCircleIcon fontSize="small" color="success" />
                            <Typography variant="caption">{permission}</Typography>
                          </Stack>
                        ))}
                        {role.permissions.length > 8 && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            +{role.permissions.length - 8} more permissions
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Box>

                  <Button variant="outlined" fullWidth onClick={() => handleEditRole(role)}>
                    Manage Permissions
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Role Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRole ? `Edit Role: ${selectedRole.name}` : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Role Name"
              fullWidth
              defaultValue={selectedRole?.name || ''}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              defaultValue={selectedRole?.description || ''}
            />
            
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Permissions
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                <List dense>
                  {allPermissions.map((permission, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          defaultChecked={selectedRole?.permissions.includes(permission)}
                        />
                      </ListItemIcon>
                      <ListItemText primary={permission} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedRole ? 'Save Changes' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

