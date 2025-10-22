// cspell:ignore mailhog minio uuidv4 nodemailer websocket servicetoken grossrevenue directcost netprofit lossreason lossnotes ownerid companyid contactid closedate adset roas codedthemes jsonwebtoken
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Server } = require('socket.io');
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger.js';

const app = express();
const PORT = process.env.DEV_BACKEND_PORT || 8787;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server and Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ============================================================================
// AUTHENTICATION (Mock JWT)
// ============================================================================

// Mock user database
const users = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    password: '123456', // In production, hash this!
    firstName: 'Demo',
    lastName: 'User'
  },
  {
    id: 'user-2',
    email: 'info@codedthemes.com',
    password: '123456',
    firstName: 'John',
    lastName: 'Doe'
  }
];

// Mock JWT token (in production, use proper JWT library)
const generateToken = (user) => {
  // This is a simple base64 token for dev - use jsonwebtoken in production
  return Buffer.from(
    JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 86400000 })
  ).toString('base64');
};

// POST /api/account/login
app.post('/api/account/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // eslint-disable-next-line no-unused-vars
  const { password: _pw, ...userWithoutPassword } = user;
  const serviceToken = generateToken(user);

  logger.info(`🔐 User logged in: ${email}`);

  res.json({
    serviceToken,
    user: userWithoutPassword
  });
});

// GET /api/account/me
app.get('/api/account/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Decode token (in production, verify JWT properly)
    const token = authHeader.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword
    });
  } catch (error) {
    logger.error('Auth error', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// POST /api/account/register (optional)
app.post('/api/account/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password, // In production, hash this!
    firstName,
    lastName
  };

  users.push(newUser);

  logger.info(`✅ User registered: ${email}`);

  // eslint-disable-next-line no-unused-vars
  const { password: _pw, ...userWithoutPassword } = newUser;

  res.json({
    user: userWithoutPassword
  });
});

// ============================================================================
// EMAIL SERVICE (MailHog)
// ============================================================================

const emailTransport = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  ignoreTLS: true
});

// Send email
app.post('/api/v1/emails/send', async (req, res) => {
  try {
    const { to, subject, html, text, from } = req.body;

    const info = await emailTransport.sendMail({
      from: from || 'Traffic CRM <noreply@trafficcrm.dev>',
      to,
      subject,
      html,
      text
    });

    logger.info('📧 Email sent', { to, subject, messageId: info.messageId });

    // Emit WebSocket notification
    io.emit('email:sent', { to, subject, timestamp: new Date() });

    res.json({
      success: true,
      messageId: info.messageId,
      preview: `http://localhost:8025`
    });
  } catch (error) {
    logger.error('Email error', error);
    res.status(500).json({ error: error.message });
  }
});

// Get email threads (mock)
const emailThreads = [];
app.get('/api/v1/emails/threads', (req, res) => {
  res.json({ items: emailThreads, total: emailThreads.length });
});

// ============================================================================
// FILE STORAGE (MinIO S3)
// ============================================================================

const s3 = new AWS.S3({
  endpoint: 'http://127.0.0.1:9000',
  accessKeyId: 'minio',
  secretAccessKey: 'minio123',
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const BUCKET_NAME = 'traffic-crm';

// Ensure bucket exists
async function ensureBucket() {
  try {
    await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
    logger.info(`✅ Bucket '${BUCKET_NAME}' exists`);
  } catch (error) {
    if (error.code === 'NotFound') {
      await s3.createBucket({ Bucket: BUCKET_NAME }).promise();
      logger.info(`✅ Created bucket '${BUCKET_NAME}'`);
    }
  }
}

const upload = multer({ storage: multer.memoryStorage() });

// Upload attachment
app.post('/api/v1/attachments', upload.single('file'), async (req, res) => {
  try {
    const { entity_type, entity_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const key = `${entity_type}/${entity_id}/${fileId}_${file.originalname}`;

    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          'original-name': file.originalname,
          'entity-type': entity_type,
          'entity-id': String(entity_id)
        }
      })
      .promise();

    const attachment = {
      id: Date.now(),
      filename: file.originalname,
      file_size: file.size,
      content_type: file.mimetype,
      entity_type,
      entity_id: Number.parseInt(entity_id, 10),
      path: key,
      created_at: new Date().toISOString()
    };

    logger.info('📎 File uploaded', attachment.filename);

    // Emit WebSocket notification
    io.emit('attachment:uploaded', attachment);

    res.json(attachment);
  } catch (error) {
    logger.error('Upload error', error);
    res.status(500).json({ error: error.message });
  }
});

// List attachments
app.get('/api/v1/attachments/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    const prefix = `${entity}/${id}/`;

    const data = await s3
      .listObjectsV2({
        Bucket: BUCKET_NAME,
        Prefix: prefix
      })
      .promise();

    const attachments = (data.Contents || []).map((obj, idx) => ({
      id: idx + 1,
      filename: obj.Key.split('/').pop().split('_').slice(1).join('_'),
      file_size: obj.Size,
      path: obj.Key,
      created_at: obj.LastModified
    }));

    res.json(attachments);
  } catch (error) {
    logger.error('List attachments error', error);
    res.json([]);
  }
});

// Download attachment
app.get('/api/v1/attachments/download/:key(*)', async (req, res) => {
  try {
    const key = req.params.key;

    const data = await s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: key
      })
      .promise();

    res.set('Content-Type', data.ContentType);
    res.set('Content-Disposition', `attachment; filename="${key.split('/').pop()}"`);
    res.send(data.Body);
  } catch (error) {
    logger.error('Download error', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Delete attachment
app.delete('/api/v1/attachments/:id', async (req, res) => {
  // For demo, just return success
  res.json({ success: true });
});

// ============================================================================
// LEADS & ATTRIBUTION
// ============================================================================

const leads = [];

// Create lead (with attribution support)
app.post('/api/leads', (req, res) => {
  const { attribution, ...leadData } = req.body;

  const lead = {
    id: uuidv4(),
    ...leadData,
    attribution: attribution || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  leads.push(lead);

  // Log attribution data if present
  if (attribution) {
    logger.info(`📊 Lead created with attribution`, {
      leadId: lead.id,
      uti: attribution.uti,
      utm_source: attribution.utm?.source,
      utm_campaign: attribution.utm?.campaign,
      ad_id: attribution.platform?.ad_id,
      adset_id: attribution.platform?.adset_id,
      campaign_id: attribution.platform?.campaign_id
    });
  } else {
    logger.info(`📝 Lead created without attribution`, { leadId: lead.id });
  }

  res.status(201).json(lead);
});

// Get all leads (with advanced filtering)
app.get('/api/leads', (req, res) => {
  const {
    page = 1,
    size = 20,
    status,
    source,
    search,
    date_from,
    date_to,
    score_min,
    score_max,
    statuses,
    sources
  } = req.query;

  let filtered = leads;

  // Text search (fuzzy across multiple fields)
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filtered = filtered.filter(
      (l) =>
        (l.firstName && l.firstName.toLowerCase().includes(searchLower)) ||
        (l.lastName && l.lastName.toLowerCase().includes(searchLower)) ||
        (l.email && l.email.toLowerCase().includes(searchLower)) ||
        (l.company && l.company.toLowerCase().includes(searchLower))
    );
  }

  // Filter by status (single or multi-select)
  if (statuses) {
    const statusList = new Set(statuses.split(',').map((s) => s.trim()));
    filtered = filtered.filter((l) => statusList.has(l.status));
  } else if (status) {
    filtered = filtered.filter((l) => l.status === status);
  }

  // Filter by source (single or multi-select)
  if (sources) {
    const sourceList = new Set(sources.split(',').map((s) => s.trim()));
    filtered = filtered.filter((l) => sourceList.has(l.source));
  } else if (source) {
    filtered = filtered.filter((l) => l.source === source);
  }

  // Filter by date range (created_at)
  if (date_from) {
    const fromDate = new Date(date_from);
    filtered = filtered.filter((l) => new Date(l.created_at) >= fromDate);
  }
  if (date_to) {
    const toDate = new Date(date_to);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((l) => new Date(l.created_at) <= toDate);
  }

  // Filter by score range
  if (score_min !== undefined) {
    const min = Number.parseFloat(score_min);
    filtered = filtered.filter((l) => l.score !== null && l.score >= min);
  }
  if (score_max !== undefined) {
    const max = Number.parseFloat(score_max);
    filtered = filtered.filter((l) => l.score !== null && l.score <= max);
  }

  // Pagination
  const pageNum = Number.parseInt(page, 10);
  const pageSize = Number.parseInt(size, 10);
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const paginatedLeads = filtered.slice(start, end);

  logger.info('📋 Leads filtered', {
    total: filtered.length,
    filters: {
      search,
      statuses: statuses || status,
      sources: sources || source,
      date_from,
      date_to,
      score_min,
      score_max
    }
  });

  res.json({
    items: paginatedLeads,
    total: filtered.length,
    page: pageNum,
    size: pageSize,
    pages: Math.ceil(filtered.length / pageSize)
  });
});

// Get single lead
app.get('/api/leads/:id', (req, res) => {
  const lead = leads.find((l) => l.id === req.params.id);

  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  res.json(lead);
});

// Update lead
app.patch('/api/leads/:id', (req, res) => {
  const index = leads.findIndex((l) => l.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  leads[index] = {
    ...leads[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  logger.info(`✏️  Lead updated`, { leadId: leads[index].id });

  res.json(leads[index]);
});

// Delete lead
app.delete('/api/leads/:id', (req, res) => {
  const index = leads.findIndex((l) => l.id === req.params.id);

  if (index !== -1) {
    const deletedLead = leads.splice(index, 1)[0];
    logger.info(`🗑️  Lead deleted`, { leadId: deletedLead.id });
  }

  res.json({ success: true });
});

// ============================================================================
// DEALS & FINANCIAL GUARDRAILS
// ============================================================================

const deals = [];

// Helper: compute net profit
function computeNetProfit(grossRevenue, directCost) {
  return Number(grossRevenue) - Number(directCost);
}

// Create deal
app.post('/api/deals', (req, res) => {
  const deal = {
    id: uuidv4(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  deals.push(deal);

  logger.info(`📝 Deal created`, { dealId: deal.id, name: deal.name });

  res.status(201).json(deal);
});

// Get all deals (with advanced filtering)
app.get('/api/deals', (req, res) => {
  const {
    page = 1,
    size = 20,
    status,
    stage,
    search,
    date_from,
    date_to,
    amount_min,
    amount_max,
    statuses,
    stages
  } = req.query;

  let filtered = deals;

  // Text search (fuzzy across name field)
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filtered = filtered.filter((d) => d.name && d.name.toLowerCase().includes(searchLower));
  }

  // Filter by status (single or multi-select)
  if (statuses) {
    const statusList = new Set(statuses.split(',').map((s) => s.trim()));
    filtered = filtered.filter((d) => statusList.has(d.status));
  } else if (status) {
    filtered = filtered.filter((d) => d.status === status);
  }

  // Filter by stage (single or multi-select)
  if (stages) {
    const stageList = new Set(stages.split(',').map((s) => s.trim()));
    filtered = filtered.filter((d) => stageList.has(d.stage));
  } else if (stage) {
    filtered = filtered.filter((d) => d.stage === stage);
  }

  // Filter by date range (close_date)
  if (date_from) {
    const fromDate = new Date(date_from);
    filtered = filtered.filter((d) => d.close_date && new Date(d.close_date) >= fromDate);
  }
  if (date_to) {
    const toDate = new Date(date_to);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((d) => d.close_date && new Date(d.close_date) <= toDate);
  }

  // Filter by amount range
  if (amount_min !== undefined) {
    const min = Number.parseFloat(amount_min);
    filtered = filtered.filter((d) => d.amount >= min);
  }
  if (amount_max !== undefined) {
    const max = Number.parseFloat(amount_max);
    filtered = filtered.filter((d) => d.amount <= max);
  }

  // Pagination
  const pageNum = Number.parseInt(page, 10);
  const pageSize = Number.parseInt(size, 10);
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const paginatedDeals = filtered.slice(start, end);

  logger.info('📋 Deals filtered', {
    total: filtered.length,
    filters: {
      search,
      statuses: statuses || status,
      stages: stages || stage,
      date_from,
      date_to,
      amount_min,
      amount_max
    }
  });

  res.json({
    items: paginatedDeals,
    total: filtered.length,
    page: pageNum,
    size: pageSize,
    pages: Math.ceil(filtered.length / pageSize)
  });
});

// Get single deal
app.get('/api/deals/:id', (req, res) => {
  const deal = deals.find((d) => d.id === req.params.id);

  if (!deal) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  res.json(deal);
});

// Update deal (with Closed Won validation)
app.patch('/api/deals/:id', (req, res) => {
  const { id } = req.params;
  const index = deals.findIndex((d) => d.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  const deal = deals[index];
  const nextStatus = req.body.status ?? deal.status;

  // Intercept Closed Won transition
  const isClosingWon =
    deal.status !== 'Closed Won' &&
    deal.status !== 'Won' &&
    (nextStatus === 'Closed Won' || nextStatus === 'Won');

  if (isClosingWon) {
    const grossRevenue = req.body.gross_revenue;
    const directCost = req.body.direct_cost;

    if (Number(grossRevenue) <= 0 || Number(directCost) <= 0) {
      return res.status(400).json({
        message:
          'gross_revenue and direct_cost are required and must be > 0 when transitioning to Closed Won'
      });
    }

    deal.gross_revenue = Number(grossRevenue);
    deal.direct_cost = Number(directCost);
    deal.net_profit = computeNetProfit(grossRevenue, directCost);

    logger.info(`💰 Deal marked Closed Won`, {
      dealId: deal.id,
      grossRevenue: deal.gross_revenue,
      directCost: deal.direct_cost,
      netProfit: deal.net_profit
    });
  }

  // Intercept Lost transition - require loss_reason
  const isMarkingLost = deal.status !== 'Lost' && (nextStatus === 'Lost' || nextStatus === 'lost');

  if (isMarkingLost) {
    const lossReason = req.body.loss_reason;

    // Fixed taxonomy
    const validReasons = [
      'L-Price/Budget',
      'L-Timing/Postponed',
      'L-Qualification/Not a fit',
      'L-Competitor',
      'L-No response',
      'L-Other'
    ];

    if (!lossReason || !validReasons.includes(lossReason)) {
      return res.status(400).json({
        message: `loss_reason is required when transitioning to Lost. Valid values: ${validReasons.join(', ')}`
      });
    }

    deal.loss_reason = lossReason;
    if (req.body.loss_notes) {
      deal.loss_notes = req.body.loss_notes;
    }

    logger.info(`❌ Deal marked Lost`, {
      dealId: deal.id,
      lossReason: deal.loss_reason,
      lossNotes: deal.loss_notes || '(none)'
    });
  }

  // Apply other patch fields
  if (req.body.name) deal.name = req.body.name;
  if (req.body.amount !== undefined) deal.amount = req.body.amount;
  if (req.body.stage) deal.stage = req.body.stage;
  if (req.body.status) deal.status = req.body.status;
  if (req.body.ownerId) deal.ownerId = req.body.ownerId;
  if (req.body.companyId !== undefined) deal.companyId = req.body.companyId;
  if (req.body.contactId !== undefined) deal.contactId = req.body.contactId;
  if (req.body.closeDate !== undefined) deal.closeDate = req.body.closeDate;
  if (req.body.probability !== undefined) deal.probability = req.body.probability;
  if (req.body.description !== undefined) deal.description = req.body.description;

  deal.updated_at = new Date().toISOString();

  deals[index] = deal;

  logger.info(`✏️  Deal updated`, { dealId: deal.id });

  res.json(deal);
});

// Delete deal
app.delete('/api/deals/:id', (req, res) => {
  const index = deals.findIndex((d) => d.id === req.params.id);

  if (index !== -1) {
    const deletedDeal = deals.splice(index, 1)[0];
    logger.info(`🗑️  Deal deleted`, { dealId: deletedDeal.id });
  }

  res.json({ success: true });
});

// ============================================================================
// P&L (PROFIT & LOSS) ANALYTICS
// ============================================================================

// Stub P&L data (will be computed from real data in production)
function generateMockPnLData() {
  return {
    summary: {
      total_leads: 150,
      total_deals: 12,
      total_gross_revenue: 144000,
      total_direct_cost: 36000,
      total_net_profit: 108000,
      average_roas: 4,
      average_cpa: 240
    },
    rows: [
      {
        utm_source: 'facebook',
        utm_campaign: 'spring_sale',
        ad_id: '12345',
        leads_count: 50,
        deals_count: 5,
        gross_revenue: 60000,
        direct_cost: 10000,
        net_profit: 50000,
        roas: 6,
        cpa: 200
      },
      {
        utm_source: 'google',
        utm_campaign: 'winter_promo',
        ad_id: '67890',
        leads_count: 40,
        deals_count: 4,
        gross_revenue: 48000,
        direct_cost: 12000,
        net_profit: 36000,
        roas: 4,
        cpa: 300
      },
      {
        utm_source: 'twitter',
        utm_campaign: 'brand_awareness',
        ad_id: '99999',
        leads_count: 30,
        deals_count: 2,
        gross_revenue: 24000,
        direct_cost: 8000,
        net_profit: 16000,
        roas: 3,
        cpa: 267
      },
      {
        utm_source: 'linkedin',
        utm_campaign: 'b2b_outreach',
        ad_id: '11111',
        leads_count: 30,
        deals_count: 1,
        gross_revenue: 12000,
        direct_cost: 6000,
        net_profit: 6000,
        roas: 2,
        cpa: 200
      }
    ]
  };
}

// GET /api/v1/pnl - P&L analytics with filters
app.get('/api/v1/pnl', (req, res) => {
  const { utm_source, utm_campaign, ad_id, date_from, date_to } = req.query;

  // Generate stub data
  const data = generateMockPnLData();

  // Apply filters
  let filteredRows = data.rows;

  if (utm_source) {
    filteredRows = filteredRows.filter((row) => row.utm_source === utm_source);
  }

  if (utm_campaign) {
    filteredRows = filteredRows.filter((row) => row.utm_campaign === utm_campaign);
  }

  if (ad_id) {
    filteredRows = filteredRows.filter((row) => row.ad_id === ad_id);
  }

  // Recompute summary based on filtered rows
  const summary = {
    total_leads: filteredRows.reduce((sum, row) => sum + row.leads_count, 0),
    total_deals: filteredRows.reduce((sum, row) => sum + row.deals_count, 0),
    total_gross_revenue: filteredRows.reduce((sum, row) => sum + row.gross_revenue, 0),
    total_direct_cost: filteredRows.reduce((sum, row) => sum + row.direct_cost, 0),
    total_net_profit: filteredRows.reduce((sum, row) => sum + row.net_profit, 0),
    average_roas: 0,
    average_cpa: 0
  };

  // Calculate averages
  if (filteredRows.length > 0) {
    summary.average_roas =
      filteredRows.reduce((sum, row) => sum + row.roas, 0) / filteredRows.length;
    summary.average_cpa = filteredRows.reduce((sum, row) => sum + row.cpa, 0) / filteredRows.length;
  }

  logger.info('📊 P&L data requested', {
    filters: { utm_source, utm_campaign, ad_id, date_from, date_to },
    rows_returned: filteredRows.length
  });

  res.json({
    summary,
    rows: filteredRows,
    filters_applied: {
      utm_source: utm_source || null,
      utm_campaign: utm_campaign || null,
      ad_id: ad_id || null,
      date_from: date_from || null,
      date_to: date_to || null
    }
  });
});

// ============================================================================
// JOURNEY EVENTS (ACTIVITY TIMELINE)
// ============================================================================

const journeyEvents = [];

// POST /api/v1/journey-events - Create a journey event
app.post('/api/v1/journey-events', (req, res) => {
  const { entity_type, entity_id, type, payload, occurred_at } = req.body;

  // Validate required fields
  if (!entity_type || !entity_id || !type) {
    return res.status(400).json({
      message: 'entity_type, entity_id, and type are required'
    });
  }

  // Validate entity_type
  if (entity_type !== 'deal' && entity_type !== 'lead') {
    return res.status(400).json({
      message: 'entity_type must be "deal" or "lead"'
    });
  }

  const event = {
    id: String(Date.now()),
    entity_type,
    entity_id: String(entity_id),
    type,
    payload: payload || {},
    occurred_at: occurred_at || new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  journeyEvents.push(event);

  logger.info(`📝 Journey event created`, {
    eventId: event.id,
    entityType: event.entity_type,
    entityId: event.entity_id,
    type: event.type
  });

  // Emit WebSocket event for real-time updates
  io.emit('journey:new', event);

  res.json(event);
});

// GET /api/v1/journey-events - List journey events for an entity
app.get('/api/v1/journey-events', (req, res) => {
  const { entity_type, entity_id, limit, offset, since } = req.query;

  if (!entity_type || !entity_id) {
    return res.status(400).json({
      message: 'entity_type and entity_id query parameters are required'
    });
  }

  // Filter events by entity
  let filtered = journeyEvents.filter(
    (e) => e.entity_type === entity_type && String(e.entity_id) === String(entity_id)
  );

  // Filter by timestamp if 'since' is provided
  if (since) {
    filtered = filtered.filter((e) => new Date(e.occurred_at) > new Date(since));
  }

  // Sort by occurred_at descending (most recent first)
  filtered.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());

  const total = filtered.length;

  // Apply pagination
  const offsetNum = Number.parseInt(offset, 10) || 0;
  const limitNum = Number.parseInt(limit, 10) || 50;
  const paginatedEvents = filtered.slice(offsetNum, offsetNum + limitNum);

  logger.info(`📋 Journey events listed`, {
    entityType: entity_type,
    entityId: entity_id,
    total,
    returned: paginatedEvents.length
  });

  res.json({
    items: paginatedEvents,
    total
  });
});

// ============================================================================
// COMMENTS & MENTIONS
// ============================================================================

const comments = [];

// Create comment
app.post('/api/v1/comments', (req, res) => {
  const comment = {
    id: Date.now(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  comments.push(comment);

  logger.info('💬 Comment created', comment.id);

  // Emit WebSocket notification
  io.emit('comment:new', comment);

  // If there are mentions, emit notifications
  if (comment.mentions && comment.mentions.length > 0) {
    for (const userId of comment.mentions) {
      io.emit('mention:new', { userId, comment });
    }
  }

  res.json(comment);
});

// Get comments for entity
app.get('/api/v1/comments', (req, res) => {
  const { entity_type, entity_id } = req.query;

  let filtered = comments;
  if (entity_type && entity_id) {
    filtered = comments.filter(
      (c) => c.entity_type === entity_type && c.entity_id === Number.parseInt(entity_id, 10)
    );
  }

  res.json({ items: filtered, total: filtered.length });
});

// Update comment
app.patch('/api/v1/comments/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const index = comments.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  comments[index] = {
    ...comments[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  io.emit('comment:updated', comments[index]);

  res.json(comments[index]);
});

// Delete comment
app.delete('/api/v1/comments/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const index = comments.findIndex((c) => c.id === id);

  if (index !== -1) {
    comments.splice(index, 1);
    io.emit('comment:deleted', { id });
  }

  res.json({ success: true });
});

// ============================================================================
// NOTIFICATIONS
// ============================================================================

const notifications = [];

// Create notification
app.post('/api/v1/notifications', (req, res) => {
  const notification = {
    id: Date.now(),
    ...req.body,
    is_read: false,
    created_at: new Date().toISOString()
  };

  notifications.push(notification);

  logger.info('🔔 Notification created', notification.title);

  // Emit via WebSocket
  io.emit('notification:new', notification);

  res.json(notification);
});

// Get notifications
app.get('/api/v1/notifications', (req, res) => {
  res.json({ items: notifications, total: notifications.length });
});

// Mark as read
app.patch('/api/v1/notifications/:id/read', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const notification = notifications.find((n) => n.id === id);

  if (notification) {
    notification.is_read = true;
    io.emit('notification:read', { id });
  }

  res.json({ success: true });
});

// Mark all as read
app.patch('/api/v1/notifications/mark-all-read', (req, res) => {
  for (const n of notifications) {
    n.is_read = true;
  }
  io.emit('notifications:all-read');
  res.json({ success: true });
});

// ============================================================================
// WEBHOOKS
// ============================================================================

// Test webhook
app.post('/api/v1/webhooks/test', (req, res) => {
  logger.debug('🪝 Webhook received', JSON.stringify(req.body, null, 2));
  res.json({ success: true, received: req.body });
});

// Trigger webhook (for testing)
app.post('/api/v1/webhooks/trigger', (req, res) => {
  const { event, data } = req.body;

  logger.info(`🪝 Triggering webhook: ${event}`);

  io.emit('webhook:triggered', { event, data, timestamp: new Date() });

  res.json({ success: true });
});

// ============================================================================
// AI STUB
// ============================================================================

// Lead scoring
app.post('/api/v1/ai/score-lead', (req, res) => {
  const { lead } = req.body;

  // Deterministic scoring based on lead properties
  let score = 50;
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  if (lead.company) score += 15;
  if (lead.title) score += 15;

  res.json({
    score: Math.min(score, 100),
    factors: {
      email: lead.email ? 10 : 0,
      phone: lead.phone ? 10 : 0,
      company: lead.company ? 15 : 0,
      title: lead.title ? 15 : 0
    }
  });
});

// Next best action
app.post('/api/v1/ai/next-action', (req, res) => {
  const actions = [
    { action: 'schedule_call', confidence: 0.85, reason: 'No contact in 7 days' },
    { action: 'send_proposal', confidence: 0.72, reason: 'Deal in qualification stage' },
    { action: 'follow_up_email', confidence: 0.68, reason: 'Last email not opened' }
  ];

  res.json({ suggestions: actions });
});

// Email suggestions
app.post('/api/v1/ai/suggest-email', (req, res) => {
  const { context } = req.body;

  res.json({
    subject: `Following up on ${context.deal_name || 'our conversation'}`,
    body: `Hi ${context.contact_name || 'there'},\n\nI wanted to follow up on our recent discussion about ${context.deal_name || 'your needs'}.\n\nWould you be available for a quick call this week?\n\nBest regards`
  });
});

// ============================================================================
// WEBSOCKET HANDLERS
// ============================================================================

io.on('connection', (socket) => {
  logger.info('🔌 Client connected', socket.id);

  socket.on('disconnect', () => {
    logger.info('🔌 Client disconnected', socket.id);
  });

  // User presence
  socket.on('user:online', (data) => {
    socket.broadcast.emit('user:status', { ...data, status: 'online' });
  });

  socket.on('user:offline', (data) => {
    socket.broadcast.emit('user:status', { ...data, status: 'offline' });
  });

  // Typing indicators
  socket.on('typing:start', (data) => {
    socket.broadcast.emit('typing:indicator', { ...data, typing: true });
  });

  socket.on('typing:stop', (data) => {
    socket.broadcast.emit('typing:indicator', { ...data, typing: false });
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      api: 'running',
      websocket: 'running',
      mailhog: 'http://localhost:8025',
      minio: 'http://localhost:9001'
    }
  });
});

// ============================================================================
// START SERVER
// ============================================================================

(async function startServer() {
  try {
    // Ensure MinIO bucket exists
    await ensureBucket();

    const host = process.env.HOST || '127.0.0.1';
    httpServer.listen(PORT, host, () => {
      logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Traffic CRM Dev Backend                              ║
║                                                            ║
║   API Server:    http://${host}:${PORT}                    ║
║   WebSocket:     ws://${host}:${PORT}                      ║
║                                                            ║
║   📧 MailHog:     http://localhost:8025                    ║
║   📦 MinIO:       http://localhost:9001                    ║
║      (user: minio, pass: minio123)                        ║
║                                                            ║
║   Health Check:  http://${host}:${PORT}/health            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
})();
