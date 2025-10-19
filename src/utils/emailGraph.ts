// Minimal Microsoft Graph email helpers for development/demo

export type GraphEmailMessage = {
  subject: string;
  body: { contentType: 'HTML' | 'Text'; content: string };
  toRecipients: Array<{ emailAddress: { address: string } }>;
};

export const EMAIL_TEMPLATES = {
  DEMO_FOLLOWUP: {
    subject: 'Following up on your demo',
    body: (name: string, days: number) => ({
      content: `<p>Hi ${name},</p><p>Thanks for joining the demo. Let us know if you have questions.</p><p>Best,<br/>Traffic CRM Team</p>`,
    }),
  },
  TRIAL_REMINDER: {
    subject: 'Your trial reminder',
    body: (name: string, days: number) => ({
      content: `<p>Hi ${name},</p><p>Your trial ends in ${days} days. Need any help to get the most out of it?</p><p>Best,<br/>Traffic CRM Team</p>`,
    }),
  },
} as const;

export async function sendEmail(_accessToken: string, _message: GraphEmailMessage): Promise<{ id: string }> {
  // No-op mock for local/dev; integrate real Graph API in production
  return { id: `mock-${Date.now()}` };
}

export async function linkEmailToRecord(_messageId: string, _recordType: 'lead' | 'contact' | 'deal', _recordId: string): Promise<void> {
  // No-op mock for local/dev linking
}
