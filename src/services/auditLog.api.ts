import axios from 'axios';

// Types
export interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceType: 'contact' | 'company' | 'deal' | 'user' | 'settings';
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

export interface AuditLogFilters {
  search?: string;
  action?: string;
  resourceType?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  data: AuditEntry[];
  total: number;
  page: number;
  limit: number;
}

// API Client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Mock Data
const mockAuditLog: AuditEntry[] = [
  {
    id: 1,
    timestamp: '2024-10-18 14:32:15',
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Enterprise Software License',
    resourceType: 'deal',
    details: 'Created new deal worth $50,000',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 2,
    timestamp: '2024-10-18 14:15:42',
    user: 'john@example.com',
    action: 'Updated',
    resource: 'Acme Corp',
    resourceType: 'company',
    details: 'Updated company revenue to $50M-$100M',
    ipAddress: '192.168.1.101',
    status: 'success',
  },
  {
    id: 3,
    timestamp: '2024-10-18 13:58:23',
    user: 'sarah@example.com',
    action: 'Deleted',
    resource: 'Old Contact',
    resourceType: 'contact',
    details: 'Deleted inactive contact',
    ipAddress: '192.168.1.102',
    status: 'success',
  },
  {
    id: 4,
    timestamp: '2024-10-18 13:45:10',
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Sales Rep',
    resourceType: 'user',
    details: 'Created new user account',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 5,
    timestamp: '2024-10-18 13:30:05',
    user: 'mike@example.com',
    action: 'Updated',
    resource: 'Cloud Migration Project',
    resourceType: 'deal',
    details: 'Moved deal to Qualification stage',
    ipAddress: '192.168.1.103',
    status: 'success',
  },
  {
    id: 6,
    timestamp: '2024-10-18 13:12:50',
    user: 'admin@example.com',
    action: 'Updated',
    resource: 'System Settings',
    resourceType: 'settings',
    details: 'Updated email notification preferences',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 7,
    timestamp: '2024-10-18 12:58:30',
    user: 'emily@example.com',
    action: 'Created',
    resource: 'TechStart Inc',
    resourceType: 'company',
    details: 'Added new company to database',
    ipAddress: '192.168.1.104',
    status: 'success',
  },
  {
    id: 8,
    timestamp: '2024-10-18 12:45:15',
    user: 'david@example.com',
    action: 'Updated',
    resource: 'Consulting Services',
    resourceType: 'deal',
    details: 'Updated deal value to $100,000',
    ipAddress: '192.168.1.105',
    status: 'success',
  },
  {
    id: 9,
    timestamp: '2024-10-18 12:30:00',
    user: 'admin@example.com',
    action: 'Deleted',
    resource: 'Inactive User',
    resourceType: 'user',
    details: 'Removed user account due to inactivity',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 10,
    timestamp: '2024-10-18 12:15:45',
    user: 'lisa@example.com',
    action: 'Created',
    resource: 'John Smith',
    resourceType: 'contact',
    details: 'Added new contact to Acme Corp',
    ipAddress: '192.168.1.106',
    status: 'success',
  },
  {
    id: 11,
    timestamp: '2024-10-18 12:00:30',
    user: 'robert@example.com',
    action: 'Updated',
    resource: 'API Integration',
    resourceType: 'deal',
    details: 'Moved deal to Proposal stage',
    ipAddress: '192.168.1.107',
    status: 'success',
  },
  {
    id: 12,
    timestamp: '2024-10-18 11:45:20',
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Manager Role',
    resourceType: 'settings',
    details: 'Created new role with custom permissions',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
];

// API Functions
export async function fetchAuditLog(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
  try {
    const response = await apiClient.get<AuditLogResponse>('/audit-log', { params: filters });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    
    // Apply filters to mock data
    let filtered = [...mockAuditLog];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.user.toLowerCase().includes(searchLower) ||
        entry.resource.toLowerCase().includes(searchLower) ||
        entry.details.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.action && filters.action !== 'all') {
      filtered = filtered.filter(entry => entry.action.toLowerCase() === filters.action);
    }
    
    if (filters.resourceType && filters.resourceType !== 'all') {
      filtered = filtered.filter(entry => entry.resourceType === filters.resourceType);
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
    };
  }
}

export async function exportAuditLog(filters: AuditLogFilters = {}): Promise<Blob> {
  try {
    const response = await apiClient.get('/audit-log/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.warn('Export API not available:', error);
    // Return mock CSV
    const csv = 'Timestamp,User,Action,Resource,Type,Details,IP,Status\n' +
      mockAuditLog.map(e => `${e.timestamp},${e.user},${e.action},${e.resource},${e.resourceType},${e.details},${e.ipAddress},${e.status}`).join('\n');
    return new Blob([csv], { type: 'text/csv' });
  }
}

