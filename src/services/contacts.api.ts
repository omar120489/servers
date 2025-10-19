/**
 * Contacts API Service
 * 
 * Handles all API calls related to contacts.
 * Uses axios for HTTP requests with proper error handling.
 */

import axios from 'axios';

// Create API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'inactive' | 'lead';
}

// Mock data for fallback when API is unavailable
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

/**
 * Fetch all contacts
 * 
 * @returns Promise<Contact[]>
 */
export async function getContacts(): Promise<Contact[]> {
  try {
    const response = await apiClient.get<Contact[]>('/contacts');
    return response.data;
  } catch (error) {
    console.warn('[Contacts API] Failed to fetch contacts, using mock data:', error);
    // Return mock data as fallback
    return mockContacts;
  }
}

/**
 * Fetch a single contact by ID
 * 
 * @param id - Contact ID
 * @returns Promise<Contact>
 */
export async function getContact(id: number): Promise<Contact> {
  try {
    const response = await apiClient.get<Contact>(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`[Contacts API] Failed to fetch contact ${id}, using mock data:`, error);
    // Return mock data as fallback
    const contact = mockContacts.find(c => c.id === id);
    if (!contact) {
      throw new Error(`Contact ${id} not found`);
    }
    return contact;
  }
}

/**
 * Create a new contact
 * 
 * @param contact - Contact data (without ID)
 * @returns Promise<Contact>
 */
export async function createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  try {
    const response = await apiClient.post<Contact>('/contacts', contact);
    return response.data;
  } catch (error) {
    console.error('[Contacts API] Failed to create contact:', error);
    throw error;
  }
}

/**
 * Update an existing contact
 * 
 * @param id - Contact ID
 * @param contact - Partial contact data to update
 * @returns Promise<Contact>
 */
export async function updateContact(id: number, contact: Partial<Contact>): Promise<Contact> {
  try {
    const response = await apiClient.put<Contact>(`/contacts/${id}`, contact);
    return response.data;
  } catch (error) {
    console.error(`[Contacts API] Failed to update contact ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a contact
 * 
 * @param id - Contact ID
 * @returns Promise<void>
 */
export async function deleteContact(id: number): Promise<void> {
  try {
    await apiClient.delete(`/contacts/${id}`);
  } catch (error) {
    console.error(`[Contacts API] Failed to delete contact ${id}:`, error);
    throw error;
  }
}

