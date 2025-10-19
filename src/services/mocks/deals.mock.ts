/**
 * Mock data for Deals
 * Deterministic data with seeded IDs for testing
 */

export interface MockDeal {
  id: string;
  title: string;
  value: number;
  stage: string;
  company?: string;
  contact?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
  created_at?: string;
}

export const mockDeals: MockDeal[] = [
  { 
    id: '1', 
    title: 'Enterprise Software License', 
    value: 50000, 
    stage: 'prospecting', 
    company: 'Acme Corp', 
    contact: 'John Smith',
    owner: 'John Doe',
    probability: 30,
    expectedCloseDate: '2024-11-15',
    tags: ['enterprise', 'high-value'],
    notes: 'Large enterprise client with potential for expansion',
    created_at: '2024-10-01T10:00:00Z',
  },
  { 
    id: '2', 
    title: 'Cloud Migration Project', 
    value: 75000, 
    stage: 'prospecting', 
    company: 'TechStart Inc', 
    contact: 'Sarah Johnson',
    owner: 'Jane Smith',
    probability: 25,
    expectedCloseDate: '2024-12-01',
    tags: ['cloud', 'migration'],
    notes: 'Cloud infrastructure modernization project',
    created_at: '2024-10-02T11:00:00Z',
  },
  { 
    id: '3', 
    title: 'Annual Support Contract', 
    value: 25000, 
    stage: 'qualification', 
    company: 'Global Systems', 
    contact: 'Mike Chen',
    owner: 'John Doe',
    probability: 45,
    expectedCloseDate: '2024-10-30',
    tags: ['renewal', 'support'],
    notes: 'Existing customer renewal',
    created_at: '2024-10-03T12:00:00Z',
  },
  { 
    id: '4', 
    title: 'Custom Development', 
    value: 100000, 
    stage: 'qualification', 
    company: 'Innovate LLC', 
    contact: 'Emily Davis',
    owner: 'Bob Wilson',
    probability: 50,
    expectedCloseDate: '2024-11-20',
    tags: ['custom', 'development', 'high-value'],
    notes: 'Custom software development for internal tools',
    created_at: '2024-10-04T13:00:00Z',
  },
  { 
    id: '5', 
    title: 'Consulting Services', 
    value: 35000, 
    stage: 'proposal', 
    company: 'StartupXYZ', 
    contact: 'David Wilson',
    owner: 'Jane Smith',
    probability: 60,
    expectedCloseDate: '2024-10-25',
    tags: ['consulting'],
    notes: 'Strategic consulting engagement',
    created_at: '2024-10-05T14:00:00Z',
  },
  { 
    id: '6', 
    title: 'Training Package', 
    value: 15000, 
    stage: 'proposal', 
    company: 'EduTech', 
    contact: 'Lisa Anderson',
    owner: 'John Doe',
    probability: 65,
    expectedCloseDate: '2024-10-28',
    tags: ['training'],
    notes: 'Employee training program',
    created_at: '2024-10-06T15:00:00Z',
  },
  { 
    id: '7', 
    title: 'API Integration', 
    value: 45000, 
    stage: 'negotiation', 
    company: 'DataFlow Inc', 
    contact: 'Robert Taylor',
    owner: 'Bob Wilson',
    probability: 75,
    expectedCloseDate: '2024-10-22',
    tags: ['api', 'integration'],
    notes: 'Third-party API integration project',
    created_at: '2024-10-07T16:00:00Z',
  },
  { 
    id: '8', 
    title: 'Mobile App Development', 
    value: 80000, 
    stage: 'negotiation', 
    company: 'AppMakers', 
    contact: 'Jennifer Lee',
    owner: 'Jane Smith',
    probability: 80,
    expectedCloseDate: '2024-10-20',
    tags: ['mobile', 'development'],
    notes: 'iOS and Android app development',
    created_at: '2024-10-08T17:00:00Z',
  },
  { 
    id: '9', 
    title: 'SaaS Subscription', 
    value: 60000, 
    stage: 'closed_won', 
    company: 'CloudFirst', 
    contact: 'Michael Brown',
    owner: 'John Doe',
    probability: 100,
    expectedCloseDate: '2024-10-15',
    tags: ['saas'],
    notes: 'Annual SaaS subscription',
    created_at: '2024-10-09T18:00:00Z',
  },
  { 
    id: '10', 
    title: 'Security Audit', 
    value: 30000, 
    stage: 'closed_won', 
    company: 'SecureTech', 
    contact: 'Amanda White',
    owner: 'Bob Wilson',
    probability: 100,
    expectedCloseDate: '2024-10-12',
    tags: ['security'],
    notes: 'Comprehensive security audit',
    created_at: '2024-10-10T19:00:00Z',
  },
  { 
    id: '11', 
    title: 'Legacy System Upgrade', 
    value: 40000, 
    stage: 'closed_lost', 
    company: 'OldSchool Inc', 
    contact: 'James Martin',
    owner: 'Jane Smith',
    probability: 0,
    expectedCloseDate: '2024-10-10',
    tags: ['legacy'],
    notes: 'Lost to competitor',
    created_at: '2024-10-11T20:00:00Z',
  },
];

export const getMockDeals = () => {
  return {
    items: mockDeals,
    total: mockDeals.length,
  };
};

export const updateMockDeal = (id: string, updates: Partial<MockDeal>) => {
  const index = mockDeals.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDeals[index] = { ...mockDeals[index], ...updates };
    return mockDeals[index];
  }
  throw new Error('Deal not found');
};

