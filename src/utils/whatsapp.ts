/**
 * WhatsApp Business API Integration
 * 
 * Implements policy-compliant WhatsApp messaging
 * Reference: Meta WhatsApp Business Policy
 * 
 * @see https://developers.facebook.com/docs/whatsapp/overview/getting-started
 * @see https://developers.facebook.com/docs/whatsapp/pricing#conversations
 */

/**
 * WhatsApp opt-in record
 * 
 * Database schema:
 * CREATE TABLE whatsapp_optin (
 *   lead_id UUID PRIMARY KEY,
 *   consent_source TEXT NOT NULL, -- 'form' | 'chat' | 'pos' | 'email'
 *   consent_ts TIMESTAMPTZ NOT NULL,
 *   ip INET,
 *   notes TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER TABLE leads ADD COLUMN wa_last_user_msg_ts TIMESTAMPTZ;
 */

export interface WhatsAppOptIn {
  leadId: string;
  consentSource: 'form' | 'chat' | 'pos' | 'email';
  consentTimestamp: Date;
  ip?: string;
  notes?: string;
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template';
  text?: string;
  template?: {
    name: string;
    language: string;
    components: Array<{
      type: string;
      parameters: Array<{ type: string; text: string }>;
    }>;
  };
}

/**
 * Check if user can receive free-form messages (24-hour rule)
 * @param lastUserMessageTimestamp - When user last sent a message
 * @returns true if within 24-hour window
 */
export function canSendFreeform(lastUserMessageTimestamp: Date | null): boolean {
  if (!lastUserMessageTimestamp) return false;
  
  const MS_IN_24H = 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - lastUserMessageTimestamp.getTime();
  
  return elapsed <= MS_IN_24H;
}

/**
 * Validate opt-in exists
 * @param leadId - Lead ID
 * @returns Promise<boolean>
 */
export async function hasOptIn(leadId: string): Promise<boolean> {
  // In production: query database
  // SELECT EXISTS(SELECT 1 FROM whatsapp_optin WHERE lead_id = $1)
  
  // Mock implementation
  return true; // Replace with actual DB query
}

/**
 * Record opt-in
 * @param optIn - Opt-in record
 */
export async function recordOptIn(optIn: WhatsAppOptIn): Promise<void> {
  // In production: insert into database
  // INSERT INTO whatsapp_optin (lead_id, consent_source, consent_ts, ip, notes)
  // VALUES ($1, $2, $3, $4, $5)
  
  // noop for mock implementation
}

/**
 * Send WhatsApp message (policy-compliant)
 * @param leadId - Lead ID
 * @param message - Message to send
 * @param lastUserMessageTs - When user last sent a message
 */
export async function sendWhatsApp(
  leadId: string,
  message: WhatsAppMessage,
  lastUserMessageTs: Date | null
): Promise<void> {
  // 1. Check opt-in
  const hasConsent = await hasOptIn(leadId);
  if (!hasConsent) {
    throw new Error('No WhatsApp opt-in found for this lead');
  }
  
  // 2. Check 24-hour rule
  const canSendFree = canSendFreeform(lastUserMessageTs);
  
  if (canSendFree) {
    // Within 24h window - can send free-form message
    await sendSessionMessage(message);
  } else {
    // Outside 24h window - must use approved template
    if (message.type !== 'template') {
      throw new Error('Outside 24h window - must use approved template');
    }
    await sendTemplateMessage(message);
  }
}

/**
 * Send free-form message (within 24h window)
 */
async function sendSessionMessage(message: WhatsAppMessage): Promise<void> {
  // In production: call WhatsApp Business API
  // POST https://graph.facebook.com/v18.0/{phone-number-id}/messages
  // noop for mock implementation
}

/**
 * Send template message (outside 24h window)
 */
async function sendTemplateMessage(message: WhatsAppMessage): Promise<void> {
  // In production: call WhatsApp Business API with approved template
  // noop for mock implementation
}

/**
 * Approved message templates
 */
export const TEMPLATES = {
  DEMO_REMINDER: {
    name: 'demo_reminder',
    language: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{name}}' },
          { type: 'text', text: '{{time}}' },
        ],
      },
    ],
  },
  TRIAL_EXPIRING: {
    name: 'trial_expiring',
    language: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{name}}' },
          { type: 'text', text: '{{days}}' },
        ],
      },
    ],
  },
  NO_REPLY_NUDGE: {
    name: 'no_reply_nudge',
    language: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{name}}' },
        ],
      },
    ],
  },
};

/**
 * Webhook handler for incoming WhatsApp messages
 * Updates wa_last_user_msg_ts to maintain 24h window
 */
export function handleIncomingMessage(leadId: string, messageTimestamp: Date): void {
  // In production: update database
  // UPDATE leads SET wa_last_user_msg_ts = $1 WHERE id = $2
  // noop for mock implementation
}

