import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Sales Rep' | 'Viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago', createdAt: '2024-01-15' },
  { id: 2, name: 'John Manager', email: 'john@example.com', role: 'Manager', status: 'active', lastLogin: '1 day ago', createdAt: '2024-02-20' },
  { id: 3, name: 'Sarah Sales', email: 'sarah@example.com', role: 'Sales Rep', status: 'active', lastLogin: '3 hours ago', createdAt: '2024-03-10' },
  { id: 4, name: 'Mike Viewer', email: 'mike@example.com', role: 'Viewer', status: 'active', lastLogin: '5 days ago', createdAt: '2024-04-05' },
  { id: 5, name: 'Emily Pending', email: 'emily@example.com', role: 'Sales Rep', status: 'pending', lastLogin: 'Never', createdAt: '2024-10-15' },
  { id: 6, name: 'David Inactive', email: 'david@example.com', role: 'Sales Rep', status: 'inactive', lastLogin: '30 days ago', createdAt: '2024-01-20' },
];

export default function Users() {
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Manager': return 'primary';
      case 'Sales Rep': return 'info';
      case 'Viewer': return 'default';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">User Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users, roles, and access permissions
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add User
        </Button>
      </Stack>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(user.name)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {user.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={getStatusColor(user.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.lastLogin}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.createdAt}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </Typography>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon fontSize="small" sx={{ mr: 1 }} />
          {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Full Name" fullWidth />
            <TextField label="Email" type="email" fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label="Role" defaultValue="Sales Rep">
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Sales Rep">Sales Rep</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

