export type ID = string | number;

export interface BaseEntity {
  id: ID;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface User extends BaseEntity {
  email: string;
  full_name?: string;
  role?: 'admin' | 'sales_manager' | 'sales_rep';
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
export interface Lead extends BaseEntity {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  score?: number;
  owner_id?: ID;
}

export interface Contact extends BaseEntity {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  account_id?: ID;
}

export interface Account extends BaseEntity {
  name: string;
  website?: string;
  industry?: string;
}

export interface Opportunity extends BaseEntity {
  name: string;
  stage?: string;
  amount?: number;
  account_id?: ID;
  owner_id?: ID;
}

export interface Activity extends BaseEntity {
  type: 'call' | 'email' | 'meeting' | 'task';
  subject: string;
  due_date?: string;
  lead_id?: ID;
  contact_id?: ID;
  account_id?: ID;
}
