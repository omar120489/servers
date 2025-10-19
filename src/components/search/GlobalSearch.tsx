import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
  Stack,
  InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'contact' | 'company' | 'deal' | 'lead' | 'activity' | 'report';
  title: string;
  subtitle?: string;
  path: string;
}

// Mock search data
const mockSearchData: SearchResult[] = [
  // Contacts
  { id: 'c1', type: 'contact', title: 'John Smith', subtitle: 'Acme Corp • CEO', path: '/contacts' },
  { id: 'c2', type: 'contact', title: 'Sarah Johnson', subtitle: 'TechStart Inc • CTO', path: '/contacts' },
  { id: 'c3', type: 'contact', title: 'Mike Chen', subtitle: 'Global Systems • VP Sales', path: '/contacts' },
  
  // Companies
  { id: 'co1', type: 'company', title: 'Acme Corp', subtitle: 'Technology • 500 employees', path: '/companies' },
  { id: 'co2', type: 'company', title: 'TechStart Inc', subtitle: 'Software • 150 employees', path: '/companies' },
  { id: 'co3', type: 'company', title: 'Global Systems', subtitle: 'Enterprise • 1000 employees', path: '/companies' },
  
  // Deals
  { id: 'd1', type: 'deal', title: 'Enterprise Software License', subtitle: '$50,000 • Prospecting', path: '/deals' },
  { id: 'd2', type: 'deal', title: 'Cloud Migration Project', subtitle: '$75,000 • Prospecting', path: '/deals' },
  { id: 'd3', type: 'deal', title: 'Annual Support Contract', subtitle: '$25,000 • Qualification', path: '/deals' },
  
  // Leads
  { id: 'l1', type: 'lead', title: 'Alice Williams', subtitle: 'Startup Alpha • Score: 85', path: '/leads' },
  { id: 'l2', type: 'lead', title: 'Bob Martinez', subtitle: 'TechCorp • Score: 72', path: '/leads' },
  
  // Activities
  { id: 'a1', type: 'activity', title: 'Demo with Acme Corp', subtitle: 'Meeting • Oct 18, 10:00 AM', path: '/activities' },
  { id: 'a2', type: 'activity', title: 'Follow-up call with TechStart', subtitle: 'Call • Oct 18, 2:00 PM', path: '/activities' },
  
  // Reports
  { id: 'r1', type: 'report', title: 'Sales Dashboard', subtitle: 'Overview metrics and charts', path: '/reports' },
  { id: 'r2', type: 'report', title: 'Revenue by Month', subtitle: 'Monthly revenue breakdown', path: '/reports' },
];

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Simple search filter
    const searchLower = query.toLowerCase();
    const filtered = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.subtitle?.toLowerCase().includes(searchLower)
    );

    setResults(filtered.slice(0, 10)); // Limit to 10 results
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact': return <PersonIcon />;
      case 'company': return <BusinessIcon />;
      case 'deal': return <AttachMoneyIcon />;
      case 'lead': return <LeaderboardIcon />;
      case 'activity': return <EventIcon />;
      case 'report': return <DescriptionIcon />;
      default: return <SearchIcon />;
    }
  };

  const getTypeColor = (type: string): 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (type) {
      case 'contact': return 'primary';
      case 'company': return 'info';
      case 'deal': return 'success';
      case 'lead': return 'warning';
      case 'activity': return 'error';
      case 'report': return 'default';
      default: return 'default';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      setQuery('');
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setQuery('');
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          top: 100,
          m: 0,
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search contacts, companies, deals, leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        {query && results.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No results found for "{query}"
            </Typography>
          </Box>
        )}

        {results.length > 0 && (
          <>
            <Divider />
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {results.map((result, index) => (
                <React.Fragment key={result.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleSelect(result)}>
                      <ListItemIcon>
                        {getIcon(result.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1">{result.title}</Typography>
                            <Chip
                              label={result.type}
                              size="small"
                              color={getTypeColor(result.type)}
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Stack>
                        }
                        secondary={result.subtitle}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < results.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        {!query && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick tips:
            </Typography>
            <Stack spacing={1} mt={2}>
              <Typography variant="caption" color="text.secondary">
                • Press <Chip label="Cmd+K" size="small" /> or <Chip label="Ctrl+K" size="small" /> to open search
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Press <Chip label="Esc" size="small" /> to close
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Press <Chip label="Enter" size="small" /> to select first result
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}


