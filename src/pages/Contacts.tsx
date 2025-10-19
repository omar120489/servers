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
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'inactive' | 'lead';
}

const mockContacts: Contact[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@acme.com', phone: '+1 (555) 123-4567', company: 'Acme Corp', role: 'CEO', status: 'active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@techstart.io', phone: '+1 (555) 234-5678', company: 'TechStart Inc', role: 'CTO', status: 'active' },
  { id: 3, name: 'Mike Chen', email: 'mchen@globalsys.com', phone: '+1 (555) 345-6789', company: 'Global Systems', role: 'VP Sales', status: 'active' },
  { id: 4, name: 'Emily Davis', email: 'emily@innovate.com', phone: '+1 (555) 456-7890', company: 'Innovate LLC', role: 'Product Manager', status: 'lead' },
  { id: 5, name: 'David Wilson', email: 'dwilson@startupxyz.com', phone: '+1 (555) 567-8901', company: 'StartupXYZ', role: 'Founder', status: 'active' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa.a@edutech.com', phone: '+1 (555) 678-9012', company: 'EduTech', role: 'Director', status: 'active' },
  { id: 7, name: 'Robert Taylor', email: 'rtaylor@dataflow.io', phone: '+1 (555) 789-0123', company: 'DataFlow Inc', role: 'Engineer', status: 'lead' },
  { id: 8, name: 'Jennifer Lee', email: 'jlee@appmakers.com', phone: '+1 (555) 890-1234', company: 'AppMakers', role: 'Designer', status: 'active' },
];

export default function Contacts() {
  const [search, setSearch] = useState('');
  
  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase()) ||
    contact.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'lead': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Contacts</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Contact
        </Button>
      </Stack>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search contacts by name, email, or company..."
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
              <TableCell>Contact</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(contact.name)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {contact.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.role}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{contact.email}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{contact.phone}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.status}
                    color={getStatusColor(contact.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredContacts.length} of {mockContacts.length} contacts
        </Typography>
      </Box>
    </Box>
  );
}
