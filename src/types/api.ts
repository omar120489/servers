import type { UserProfile as AuthUserProfile } from './auth';

export type UUID = string;
export type ISODateString = string;

export type SortDirection = 'asc' | 'desc';

export interface BaseEntity {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PaginationQuery {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  filters?: Record<string, unknown>;
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export type DealStage =
  | 'Prospecting'
  | 'Qualification'
  | 'Discovery'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost'
  | (string & {});

export type DealStatus = 'Open' | 'Won' | 'Lost' | 'On Hold' | (string & {});

export interface Deal extends BaseEntity {
  name: string;
  amount: number;
  stage: DealStage;
  status: DealStatus;
  ownerId: UUID;
  companyId?: UUID | null;
  contactId?: UUID | null;
  closeDate?: ISODateString | null;
  probability?: number | null;
  description?: string | null;
}

export interface DealQuery extends PaginationQuery {
  stage?: DealStage;
  status?: DealStatus;
  ownerId?: UUID;
  companyId?: UUID;
}

export type DealCreateDto = Pick<Deal, 'name' | 'amount' | 'stage' | 'status' | 'ownerId'> &
  Partial<Pick<Deal, 'companyId' | 'contactId' | 'closeDate' | 'probability' | 'description'>>;

export type DealUpdateDto = Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>;

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Working'
  | 'Unqualified'
  | 'Converted'
  | (string & {});

export type LeadSource =
  | 'Web'
  | 'Referral'
  | 'Email'
  | 'Phone'
  | 'Event'
  | 'Social'
  | (string & {});

export interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: LeadStatus;
  source?: LeadSource | null;
  ownerId: UUID;
  company?: string | null;
  score?: number | null;
  notes?: string | null;
}

export interface LeadQuery extends PaginationQuery {
  status?: LeadStatus;
  source?: LeadSource;
  ownerId?: UUID;
}

export type LeadCreateDto = Pick<Lead, 'firstName' | 'lastName' | 'email' | 'status' | 'ownerId'> &
  Partial<Pick<Lead, 'phone' | 'source' | 'company' | 'score' | 'notes'>>;

export type LeadUpdateDto = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>;

export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  title?: string | null;
  companyId?: UUID | null;
  ownerId: UUID;
}

export interface ContactQuery extends PaginationQuery {
  ownerId?: UUID;
  companyId?: UUID;
}

export type ContactCreateDto = Pick<Contact, 'firstName' | 'lastName' | 'email' | 'ownerId'> &
  Partial<Pick<Contact, 'phone' | 'title' | 'companyId'>>;

export type ContactUpdateDto = Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>;

export interface Company extends BaseEntity {
  name: string;
  domain?: string | null;
  industry?: string | null;
  size?: string | null;
  ownerId: UUID;
}

export interface CompanyQuery extends PaginationQuery {
  ownerId?: UUID;
  industry?: string | null;
  companySize?: string | null;
}

export type CompanyCreateDto = Pick<Company, 'name' | 'ownerId'> &
  Partial<Pick<Company, 'domain' | 'industry' | 'size'>>;

export type CompanyUpdateDto = Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>;

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note' | (string & {});

export interface Activity extends BaseEntity {
  type: ActivityType;
  subject: string;
  description?: string | null;
  dueDate?: ISODateString | null;
  completedAt?: ISODateString | null;
  ownerId: UUID;
  leadId?: UUID | null;
  dealId?: UUID | null;
  contactId?: UUID | null;
}

export interface LoginResponse {
  serviceToken: string;
  user: UserProfile;
}

export type UserProfile = AuthUserProfile & {
  id: UUID;
  email: string;
};

export interface UserProfileResponse {
  user: UserProfile;
}

export type PaginatedDeals = PaginatedResponse<Deal>;
export type PaginatedLeads = PaginatedResponse<Lead>;
export type PaginatedContacts = PaginatedResponse<Contact>;
export type PaginatedCompanies = PaginatedResponse<Company>;
