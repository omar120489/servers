import { api } from '../api/client';
import config from '../config';

export type Activity = {
  id: number;
  type: string;
  title: string;
  description?: string;
  status?: string;
  due_date?: string;
  completed_at?: string;
  entity_type?: string;
  entity_id?: number;
  contact?: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
};

const mockActivities: Activity[] = [
  { id: 1, type: 'call', title: 'Follow-up call with Acme Corp', description: 'Discuss contract terms', status: 'completed', due_date: '2024-10-15T14:00:00Z', completed_at: '2024-10-15T14:30:00Z', entity_type: 'deal', entity_id: 1, contact: 'John Smith', company: 'Acme Corp', created_at: '2024-10-14T10:00:00Z' },
  { id: 2, type: 'email', title: 'Send proposal to TechStart', description: 'Cloud migration proposal', status: 'completed', due_date: '2024-10-16T10:00:00Z', completed_at: '2024-10-16T09:45:00Z', entity_type: 'deal', entity_id: 2, contact: 'Sarah Johnson', company: 'TechStart Inc', created_at: '2024-10-15T11:00:00Z' },
  { id: 3, type: 'meeting', title: 'Demo session with Global Systems', description: 'Product demonstration', status: 'scheduled', due_date: '2024-10-20T15:00:00Z', entity_type: 'deal', entity_id: 3, contact: 'Mike Chen', company: 'Global Systems', created_at: '2024-10-16T12:00:00Z' },
  { id: 4, type: 'task', title: 'Prepare contract for Innovate LLC', description: 'Draft custom development agreement', status: 'in_progress', due_date: '2024-10-19T17:00:00Z', entity_type: 'deal', entity_id: 4, contact: 'Emily Davis', company: 'Innovate LLC', created_at: '2024-10-17T13:00:00Z' },
  { id: 5, type: 'call', title: 'Check-in with StartupXYZ', description: 'Quarterly business review', status: 'scheduled', due_date: '2024-10-22T11:00:00Z', entity_type: 'deal', entity_id: 5, contact: 'David Wilson', company: 'StartupXYZ', created_at: '2024-10-18T14:00:00Z' },
];

export const listActivities = async (params?: any) => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    let filtered = [...mockActivities];
    
    // Apply filters if provided
    if (params?.type) {
      filtered = filtered.filter(a => a.type === params.type);
    }
    if (params?.status) {
      filtered = filtered.filter(a => a.status === params.status);
    }
    if (params?.entity_type && params?.entity_id) {
      filtered = filtered.filter(a => a.entity_type === params.entity_type && a.entity_id === params.entity_id);
    }
    
    // Sort by due_date descending
    filtered.sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
      return dateB - dateA;
    });
    
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
    const response = await api.get('/activities', { params });
    return response.data;
  } catch (error) {
    return {
      items: mockActivities,
      total: mockActivities.length,
      page: 1,
      size: 25,
      pages: 1,
    };
  }
};

export const getActivity = async (id: number) => {
  // Demo mode: find mock activity
  if (config.isDemoMode) {
    const activity = mockActivities.find(a => a.id === id);
    if (!activity) throw new Error('Activity not found');
    return Promise.resolve(activity);
  }

  // Real API call
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

export const createActivity = async (data: Partial<Activity>) => {
  // Demo mode: simulate creation
  if (config.isDemoMode) {
    const newActivity: Activity = {
      id: Date.now(),
      type: data.type || 'task',
      title: data.title || '',
      status: data.status || 'scheduled',
      ...data,
      created_at: new Date().toISOString(),
    };
    mockActivities.push(newActivity);
    return Promise.resolve(newActivity);
  }

  // Real API call
  const response = await api.post('/activities', data);
  return response.data;
};

export const updateActivity = async (id: number, data: Partial<Activity>) => {
  // Demo mode: update mock activity
  if (config.isDemoMode) {
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    mockActivities[index] = { ...mockActivities[index], ...data, updated_at: new Date().toISOString() };
    return Promise.resolve(mockActivities[index]);
  }

  // Real API call
  const response = await api.patch(`/activities/${id}`, data);
  return response.data;
};

export const deleteActivity = async (id: number) => {
  // Demo mode: simulate deletion
  if (config.isDemoMode) {
    const index = mockActivities.findIndex(a => a.id === id);
    if (index !== -1) mockActivities.splice(index, 1);
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};

export const completeActivity = async (id: number) => {
  // Demo mode: mark as completed
  if (config.isDemoMode) {
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    mockActivities[index] = { 
      ...mockActivities[index], 
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return Promise.resolve(mockActivities[index]);
  }

  // Real API call
  const response = await api.patch(`/activities/${id}/complete`);
  return response.data;
};

