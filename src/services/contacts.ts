import { api } from '../api/client';
import config from '../config';

export type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

const mockContacts: Contact[] = [
  { id: 1, first_name: 'John', last_name: 'Smith', email: 'john.smith@acme.com', phone: '+1 (555) 123-4567', company: 'Acme Corp', position: 'CEO', status: 'active', created_at: '2024-01-15T10:00:00Z' },
  { id: 2, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@techstart.com', phone: '+1 (555) 234-5678', company: 'TechStart Inc', position: 'CTO', status: 'active', created_at: '2024-02-20T11:00:00Z' },
  { id: 3, first_name: 'Mike', last_name: 'Chen', email: 'mike.chen@globalsys.com', phone: '+1 (555) 345-6789', company: 'Global Systems', position: 'VP Sales', status: 'active', created_at: '2024-03-10T12:00:00Z' },
  { id: 4, first_name: 'Emily', last_name: 'Davis', email: 'emily.d@innovate.com', phone: '+1 (555) 456-7890', company: 'Innovate LLC', position: 'Director', status: 'active', created_at: '2024-04-05T13:00:00Z' },
  { id: 5, first_name: 'David', last_name: 'Wilson', email: 'david.w@startupxyz.com', phone: '+1 (555) 567-8901', company: 'StartupXYZ', position: 'Founder', status: 'inactive', created_at: '2024-05-12T14:00:00Z' },
];

export const listContacts = async (params?: any) => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    let filtered = [...mockContacts];
    
    // Apply search filter if provided
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.first_name.toLowerCase().includes(search) ||
        c.last_name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.company?.toLowerCase().includes(search)
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
    const response = await api.get('/contacts', { params });
    return response.data;
  } catch (error) {
    return {
      items: mockContacts,
      total: mockContacts.length,
      page: 1,
      size: 25,
      pages: 1,
    };
  }
};

export const getContact = async (id: number) => {
  // Demo mode: find mock contact
  if (config.isDemoMode) {
    const contact = mockContacts.find(c => c.id === id);
    if (!contact) throw new Error('Contact not found');
    return Promise.resolve(contact);
  }

  // Real API call
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (data: Partial<Contact>) => {
  // Demo mode: simulate creation
  if (config.isDemoMode) {
    const newContact: Contact = {
      id: Date.now(),
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      ...data,
      created_at: new Date().toISOString(),
    };
    mockContacts.push(newContact);
    return Promise.resolve(newContact);
  }

  // Real API call
  const response = await api.post('/contacts', data);
  return response.data;
};

export const updateContact = async (id: number, data: Partial<Contact>) => {
  // Demo mode: update mock contact
  if (config.isDemoMode) {
    const index = mockContacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    mockContacts[index] = { ...mockContacts[index], ...data, updated_at: new Date().toISOString() };
    return Promise.resolve(mockContacts[index]);
  }

  // Real API call
  const response = await api.patch(`/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id: number) => {
  // Demo mode: simulate deletion
  if (config.isDemoMode) {
    const index = mockContacts.findIndex(c => c.id === id);
    if (index !== -1) mockContacts.splice(index, 1);
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

