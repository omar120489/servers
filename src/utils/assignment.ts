import type { Lead } from '../types/crm';

// Simple routing rules for demo purposes
export function routeLead(lead: Lead): string {
  const domain = (lead.email || '').split('@')[1] || '';
  if (domain.endsWith('.eu')) return 'user-emea-1';
  if (domain.endsWith('.jp') || domain.endsWith('.sg')) return 'user-apac-1';
  return 'user-amer-1';
}

export function shouldAutoConvert(lead: Lead): boolean {
  return (lead.score ?? 0) >= 90 && lead.status !== 'converted';
}

export async function autoConvertLead(_lead: Lead): Promise<void> {
  // Placeholder for conversion side-effect in demo
}
