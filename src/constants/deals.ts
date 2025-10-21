export const DEAL_STAGES = [
  'Prospecting',
  'Qualification',
  'Discovery',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
] as const;

export const DEAL_STATUSES = ['Open', 'Won', 'Lost', 'On Hold'] as const;

export type DealStageValue = (typeof DEAL_STAGES)[number];
export type DealStatusValue = (typeof DEAL_STATUSES)[number];
