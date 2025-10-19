/**
 * Leads API Service
 * 
 * Handles all API calls related to leads.
 * Uses axios for HTTP requests with proper error handling.
 */

import axios from 'axios';
import type { Lead } from '../types/crm';

// Create API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for fallback when API is unavailable
const mockLeads: Lead[] = [
  { id: 1, first_name: 'Alice', last_name: 'Williams', email: 'alice.w@startup.com', phone: '+1 (555) 111-2222', company: 'Startup Alpha', status: 'new', score: 85, scores: { overall: 85, health: 90, engagement: 82, urgency: 75, conversion: 88 } },
  { id: 2, first_name: 'Bob', last_name: 'Martinez', email: 'bob.m@techcorp.com', phone: '+1 (555) 222-3333', company: 'TechCorp', status: 'contacted', score: 72, scores: { overall: 72, health: 78, engagement: 70, urgency: 65, conversion: 75 } },
  { id: 3, first_name: 'Carol', last_name: 'Garcia', email: 'carol.g@innovate.io', phone: '+1 (555) 333-4444', company: 'Innovate Solutions', status: 'qualified', score: 90, scores: { overall: 90, health: 95, engagement: 88, urgency: 85, conversion: 92 } },
  { id: 4, first_name: 'David', last_name: 'Rodriguez', email: 'david.r@enterprise.com', phone: '+1 (555) 444-5555', company: 'Enterprise Co', status: 'contacted', score: 65, scores: { overall: 65, health: 70, engagement: 60, urgency: 68, conversion: 62 } },
  { id: 5, first_name: 'Emma', last_name: 'Lopez', email: 'emma.l@digital.com', phone: '+1 (555) 555-6666', company: 'Digital Agency', status: 'new', score: 78, scores: { overall: 78, health: 80, engagement: 75, urgency: 80, conversion: 77 } },
  { id: 6, first_name: 'Frank', last_name: 'Hernandez', email: 'frank.h@cloud.io', phone: '+1 (555) 666-7777', company: 'CloudTech', status: 'qualified', score: 88, scores: { overall: 88, health: 92, engagement: 85, urgency: 90, conversion: 85 } },
  { id: 7, first_name: 'Grace', last_name: 'Wilson', email: 'grace.w@saas.com', phone: '+1 (555) 777-8888', company: 'SaaS Platform', status: 'lost', score: 45, scores: { overall: 45, health: 50, engagement: 40, urgency: 42, conversion: 48 } },
  { id: 8, first_name: 'Henry', last_name: 'Anderson', email: 'henry.a@mobile.com', phone: '+1 (555) 888-9999', company: 'Mobile First', status: 'converted', score: 95, scores: { overall: 95, health: 98, engagement: 95, urgency: 92, conversion: 95 } },
];

/**
 * Fetch leads with pagination and filters
 * 
 * @param params - Query parameters (page, size, filters)
 * @returns Promise<{ data: Lead[], total: number }>
 */
export async function getLeads(params?: {
  page?: number;
  size?: number;
  status?: string;
  minScore?: number;
  maxScore?: number;
  search?: string;
}): Promise<{ data: Lead[]; total: number }> {
  try {
    const response = await apiClient.get<{ data: Lead[]; total: number }>('/leads', {
      params,
    });
    return response.data;
  } catch (error) {
    console.warn('[Leads API] Failed to fetch leads, using mock data:', error);
    // Return mock data as fallback
    return {
      data: mockLeads,
      total: mockLeads.length,
    };
  }
}

/**
 * Fetch a single lead by ID
 * 
 * @param id - Lead ID
 * @returns Promise<Lead>
 */
export async function getLead(id: number | string): Promise<Lead> {
  try {
    const response = await apiClient.get<Lead>(`/leads/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`[Leads API] Failed to fetch lead ${id}, using mock data:`, error);
    // Return mock data as fallback
    const lead = mockLeads.find(l => l.id === Number(id));
    if (!lead) {
      throw new Error(`Lead ${id} not found`);
    }
    return lead;
  }
}

/**
 * Create a new lead
 * 
 * @param lead - Lead data (without ID)
 * @returns Promise<Lead>
 */
export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
  try {
    const response = await apiClient.post<Lead>('/leads', lead);
    return response.data;
  } catch (error) {
    console.error('[Leads API] Failed to create lead:', error);
    throw error;
  }
}

/**
 * Update an existing lead
 * 
 * @param id - Lead ID
 * @param lead - Partial lead data to update
 * @returns Promise<Lead>
 */
export async function updateLead(id: number | string, lead: Partial<Lead>): Promise<Lead> {
  try {
    const response = await apiClient.put<Lead>(`/leads/${id}`, lead);
    return response.data;
  } catch (error) {
    console.error(`[Leads API] Failed to update lead ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a lead
 * 
 * @param id - Lead ID
 * @returns Promise<void>
 */
export async function deleteLead(id: number | string): Promise<void> {
  try {
    await apiClient.delete(`/leads/${id}`);
  } catch (error) {
    console.error(`[Leads API] Failed to delete lead ${id}:`, error);
    throw error;
  }
}

/**
 * Bulk update leads (change status, assign owner, etc.)
 * 
 * @param ids - Array of lead IDs
 * @param updates - Updates to apply to all leads
 * @returns Promise<Lead[]>
 */
export async function bulkUpdateLeads(
  ids: (number | string)[],
  updates: Partial<Lead>
): Promise<Lead[]> {
  try {
    const response = await apiClient.post<Lead[]>('/leads/bulk-update', {
      ids,
      updates,
    });
    return response.data;
  } catch (error) {
    console.error('[Leads API] Failed to bulk update leads:', error);
    throw error;
  }
}

/**
 * Bulk delete leads
 * 
 * @param ids - Array of lead IDs
 * @returns Promise<void>
 */
export async function bulkDeleteLeads(ids: (number | string)[]): Promise<void> {
  try {
    await apiClient.post('/leads/bulk-delete', { ids });
  } catch (error) {
    console.error('[Leads API] Failed to bulk delete leads:', error);
    throw error;
  }
}

/**
 * Convert lead to contact/deal
 * 
 * @param id - Lead ID
 * @returns Promise<{ contactId: number, dealId?: number }>
 */
export async function convertLead(id: number | string): Promise<{
  contactId: number;
  dealId?: number;
}> {
  try {
    const response = await apiClient.post<{ contactId: number; dealId?: number }>(
      `/leads/${id}/convert`
    );
    return response.data;
  } catch (error) {
    console.error(`[Leads API] Failed to convert lead ${id}:`, error);
    throw error;
  }
}

