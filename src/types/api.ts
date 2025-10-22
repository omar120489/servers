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
  grossRevenue?: number | null;
  directCost?: number | null;
  netProfit?: number | null;
  lossReason?: string | null;
  lossNotes?: string | null;
}

export interface DealQuery extends PaginationQuery {
  stage?: DealStage;
  status?: DealStatus;
  ownerId?: UUID;
  companyId?: UUID;
  search?: string;
  date_from?: string; // ISO date for close_date range start
  date_to?: string; // ISO date for close_date range end
  amount_min?: number;
  amount_max?: number;
  statuses?: string; // Comma-separated statuses for multi-select
  stages?: string; // Comma-separated stages for multi-select
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
  search?: string;
  date_from?: string; // ISO date for created_at range start
  date_to?: string; // ISO date for created_at range end
  score_min?: number;
  score_max?: number;
  statuses?: string; // Comma-separated statuses for multi-select
  sources?: string; // Comma-separated sources for multi-select
}

export interface AttributionData {
  uti: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  platform: {
    ad_id?: string;
    adset_id?: string;
    campaign_id?: string;
  };
  captured_at: string;
}

export type LeadCreateDto = Pick<Lead, 'firstName' | 'lastName' | 'email' | 'status' | 'ownerId'> &
  Partial<Pick<Lead, 'phone' | 'source' | 'company' | 'score' | 'notes'>> & {
    attribution?: AttributionData;
  };

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

export type EntityIdentifier = UUID | number;

export interface Comment {
  id: number | string;
  entityType: string;
  entityId: EntityIdentifier;
  content: string;
  mentions?: UUID[];
  authorId?: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CommentCreateDto {
  entityType: string;
  entityId: EntityIdentifier;
  content: string;
  mentions?: UUID[];
}

export interface CommentUpdateDto {
  content?: string;
  mentions?: UUID[];
}

export interface CommentListResponse {
  items: Comment[];
  total: number;
}

export interface Attachment {
  id: number | string;
  filename: string;
  fileSize?: number;
  contentType?: string | null;
  entityType?: string;
  entityId?: EntityIdentifier;
  path: string;
  createdAt: ISODateString;
}

export type AttachmentListResponse = Attachment[];

export interface Notification extends BaseEntity {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  userId?: EntityIdentifier;
  entityType?: string;
  entityId?: EntityIdentifier;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
}

export type NotificationCreateDto = Pick<
  Notification,
  'title' | 'message' | 'type' | 'entityType' | 'entityId'
>;

// P&L (Profit & Loss) Types
export interface PnLRow {
  utm_source?: string | null;
  utm_campaign?: string | null;
  ad_id?: string | null;
  leads_count: number;
  deals_count: number;
  gross_revenue: number;
  direct_cost: number;
  net_profit: number;
  roas: number; // Return on Ad Spend
  cpa: number; // Cost Per Acquisition
}

export interface PnLSummary {
  total_leads: number;
  total_deals: number;
  total_gross_revenue: number;
  total_direct_cost: number;
  total_net_profit: number;
  average_roas: number;
  average_cpa: number;
}

export interface PnLResponse {
  summary: PnLSummary;
  rows: PnLRow[];
  filters_applied: {
    utm_source?: string;
    utm_campaign?: string;
    ad_id?: string;
    date_from?: ISODateString;
    date_to?: ISODateString;
  };
}

export interface PnLQuery {
  utm_source?: string;
  utm_campaign?: string;
  ad_id?: string;
  date_from?: ISODateString;
  date_to?: ISODateString;
  group_by?: 'utm_source' | 'utm_campaign' | 'ad_id';
}

// Journey Events (Activity Timeline)
export type JourneyEventType =
  | 'status_change'
  | 'first_quote_sent'
  | 'message_sent'
  | 'agent_handoff'
  | 'deal_created'
  | 'deal_won'
  | 'deal_lost'
  | 'lead_created'
  | 'lead_converted'
  | (string & {});

export interface JourneyEvent extends BaseEntity {
  entityType: 'deal' | 'lead';
  entityId: EntityIdentifier;
  type: JourneyEventType;
  payload?: Record<string, unknown>;
  occurredAt: ISODateString;
}

export interface JourneyEventCreateDto {
  entityType: 'deal' | 'lead';
  entityId: EntityIdentifier;
  type: JourneyEventType;
  payload?: Record<string, unknown>;
  occurredAt?: ISODateString;
}

export interface JourneyEventListResponse {
  items: JourneyEvent[];
  total: number;
}
