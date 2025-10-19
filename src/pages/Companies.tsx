import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  Button,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import { SearchBar, PageHeader } from 'components/shared';

interface Company {
  id: number;
  name: string;
  industry: string;
  employees: string;
  revenue: string;
  deals: number;
  contacts: number;
  status: 'active' | 'prospect' | 'inactive';
  dealValue: number;
}

const mockCompanies: Company[] = [
  { id: 1, name: 'Acme Corp', industry: 'Technology', employees: '500-1000', revenue: '$50M-$100M', deals: 3, contacts: 5, status: 'active', dealValue: 125000 },
  { id: 2, name: 'TechStart Inc', industry: 'Software', employees: '50-100', revenue: '$10M-$50M', deals: 2, contacts: 3, status: 'active', dealValue: 150000 },
  { id: 3, name: 'Global Systems', industry: 'Enterprise', employees: '1000+', revenue: '$100M+', deals: 4, contacts: 8, status: 'active', dealValue: 200000 },
  { id: 4, name: 'Innovate LLC', industry: 'Consulting', employees: '100-500', revenue: '$50M-$100M', deals: 1, contacts: 2, status: 'prospect', dealValue: 100000 },
  { id: 5, name: 'StartupXYZ', industry: 'SaaS', employees: '10-50', revenue: '$1M-$10M', deals: 2, contacts: 4, status: 'active', dealValue: 50000 },
  { id: 6, name: 'EduTech', industry: 'Education', employees: '100-500', revenue: '$10M-$50M', deals: 1, contacts: 3, status: 'active', dealValue: 15000 },
  { id: 7, name: 'DataFlow Inc', industry: 'Analytics', employees: '50-100', revenue: '$10M-$50M', deals: 1, contacts: 2, status: 'prospect', dealValue: 45000 },
  { id: 8, name: 'AppMakers', industry: 'Mobile', employees: '100-500', revenue: '$50M-$100M', deals: 2, contacts: 4, status: 'active', dealValue: 160000 },
];

export default function Companies() {
  const [search, setSearch] = useState('');
  
  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    company.industry.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'prospect': return 'info';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalDeals = filteredCompanies.reduce((sum, c) => sum + c.deals, 0);
  const totalValue = filteredCompanies.reduce((sum, c) => sum + c.dealValue, 0);

  return (
    <Box>
      <PageHeader
        title="Companies"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Company
          </Button>
        }
      />

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Companies</Typography>
                  <Typography variant="h4" fontWeight="bold">{filteredCompanies.length}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <BusinessIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Deals</Typography>
                  <Typography variant="h4" fontWeight="bold">{totalDeals}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">Pipeline Value</Typography>
                  <Typography variant="h4" fontWeight="bold">{formatCurrency(totalValue)}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <PeopleIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 2, p: 2 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search companies by name or industry..."
        />
      </Paper>

      <Grid container spacing={2}>
        {filteredCompanies.map((company) => (
          <Grid item xs={12} md={6} lg={4} key={company.id}>
            <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {company.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {company.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {company.industry}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip
                      label={company.status}
                      color={getStatusColor(company.status)}
                      size="small"
                    />
                  </Stack>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Employees: {company.employees}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Revenue: {company.revenue}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Deals</Typography>
                      <Typography variant="h6" fontWeight="bold">{company.deals}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Contacts</Typography>
                      <Typography variant="h6" fontWeight="bold">{company.contacts}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Value</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatCurrency(company.dealValue)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Deal Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(company.deals / 5) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Button variant="outlined" fullWidth>
                    View Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
