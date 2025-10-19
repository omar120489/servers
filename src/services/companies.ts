import { api } from '../api/client';
import config from '../config';

export type Company = {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  employees?: number;
  revenue?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

const mockCompanies: Company[] = [
  { id: 1, name: 'Acme Corp', industry: 'Technology', website: 'https://acme.com', phone: '+1 (555) 100-1000', employees: 500, revenue: 50000000, status: 'active', created_at: '2024-01-10T10:00:00Z' },
  { id: 2, name: 'TechStart Inc', industry: 'Software', website: 'https://techstart.com', phone: '+1 (555) 200-2000', employees: 150, revenue: 15000000, status: 'active', created_at: '2024-02-15T11:00:00Z' },
  { id: 3, name: 'Global Systems', industry: 'Enterprise', website: 'https://globalsys.com', phone: '+1 (555) 300-3000', employees: 1000, revenue: 100000000, status: 'active', created_at: '2024-03-20T12:00:00Z' },
  { id: 4, name: 'Innovate LLC', industry: 'Consulting', website: 'https://innovate.com', phone: '+1 (555) 400-4000', employees: 75, revenue: 8000000, status: 'active', created_at: '2024-04-25T13:00:00Z' },
];

export const listCompanies = async (params?: any) => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    let filtered = [...mockCompanies];
    
    // Apply search filter if provided
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.industry?.toLowerCase().includes(search)
      );
    }
    
    return Promise.resolve({
      items: filtered,
      total: filtered.length,
      page: params?.page || 1,
      size: params?.size || 25,
      pages: Math.ceil(filtered.length / (params?.size || 25)),
    });
  }

  // Real API call with fallback
  try {
    const response = await api.get('/companies', { params });
    return response.data;
  } catch (error) {
    return {
      items: mockCompanies,
      total: mockCompanies.length,
      page: 1,
      size: 25,
      pages: 1,
    };
  }
};

export const getCompany = async (id: number) => {
  // Demo mode: find mock company
  if (config.isDemoMode) {
    const company = mockCompanies.find(c => c.id === id);
    if (!company) throw new Error('Company not found');
    return Promise.resolve(company);
  }

  // Real API call
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

export const createCompany = async (data: Partial<Company>) => {
  // Demo mode: simulate creation
  if (config.isDemoMode) {
    const newCompany: Company = {
      id: Date.now(),
      name: data.name || '',
      ...data,
      created_at: new Date().toISOString(),
    };
    mockCompanies.push(newCompany);
    return Promise.resolve(newCompany);
  }

  // Real API call
  const response = await api.post('/companies', data);
  return response.data;
};

export const updateCompany = async (id: number, data: Partial<Company>) => {
  // Demo mode: update mock company
  if (config.isDemoMode) {
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    mockCompanies[index] = { ...mockCompanies[index], ...data, updated_at: new Date().toISOString() };
    return Promise.resolve(mockCompanies[index]);
  }

  // Real API call
  const response = await api.patch(`/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id: number) => {
  // Demo mode: simulate deletion
  if (config.isDemoMode) {
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) mockCompanies.splice(index, 1);
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};

