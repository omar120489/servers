/**
 * Mock data for Leads
 * Deterministic data with seeded IDs for testing
 */
import type { Lead } from '../../types/crm';

export const mockLeads: Lead[] = [
  { 
    id: 1, 
    first_name: 'Alice', 
    last_name: 'Williams', 
    email: 'alice.w@startup.com', 
    phone: '+1 (555) 111-2222', 
    company: 'Startup Alpha', 
    status: 'new', 
    score: 85,
    created_at: '2024-10-01T10:00:00Z',
  },
  { 
    id: 2, 
    first_name: 'Bob', 
    last_name: 'Martinez', 
    email: 'bob.m@techcorp.com', 
    phone: '+1 (555) 222-3333', 
    company: 'TechCorp', 
    status: 'contacted', 
    score: 72,
    created_at: '2024-10-02T11:00:00Z',
  },
  { 
    id: 3, 
    first_name: 'Carol', 
    last_name: 'Garcia', 
    email: 'carol.g@innovate.io', 
    phone: '+1 (555) 333-4444', 
    company: 'Innovate Solutions', 
    status: 'qualified', 
    score: 90,
    created_at: '2024-10-03T12:00:00Z',
  },
  { 
    id: 4, 
    first_name: 'David', 
    last_name: 'Rodriguez', 
    email: 'david.r@enterprise.com', 
    phone: '+1 (555) 444-5555', 
    company: 'Enterprise Co', 
    status: 'contacted', 
    score: 65,
    created_at: '2024-10-04T13:00:00Z',
  },
  { 
    id: 5, 
    first_name: 'Emma', 
    last_name: 'Lopez', 
    email: 'emma.l@digital.com', 
    phone: '+1 (555) 555-6666', 
    company: 'Digital Agency', 
    status: 'new', 
    score: 78,
    created_at: '2024-10-05T14:00:00Z',
  },
  { 
    id: 6, 
    first_name: 'Frank', 
    last_name: 'Hernandez', 
    email: 'frank.h@cloud.io', 
    phone: '+1 (555) 666-7777', 
    company: 'CloudTech', 
    status: 'qualified', 
    score: 88,
    created_at: '2024-10-06T15:00:00Z',
  },
  { 
    id: 7, 
    first_name: 'Grace', 
    last_name: 'Wilson', 
    email: 'grace.w@saas.com', 
    phone: '+1 (555) 777-8888', 
    company: 'SaaS Platform', 
    status: 'lost', 
    score: 45,
    created_at: '2024-10-07T16:00:00Z',
  },
  { 
    id: 8, 
    first_name: 'Henry', 
    last_name: 'Anderson', 
    email: 'henry.a@mobile.com', 
    phone: '+1 (555) 888-9999', 
    company: 'Mobile First', 
    status: 'converted', 
    score: 95,
    created_at: '2024-10-08T17:00:00Z',
  },
];

export const getMockLeads = (page = 1, size = 25, search?: string) => {
  let filtered = mockLeads;
  
  if (search) {
    const query = search.toLowerCase();
    filtered = mockLeads.filter(lead =>
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query)
    );
  }
  
  const start = (page - 1) * size;
  const end = start + size;
  const items = filtered.slice(start, end);
  
  return {
    items,
    total: filtered.length,
    page,
    size,
    pages: Math.ceil(filtered.length / size),
  };
};

