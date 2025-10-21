import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import { createServer } from 'http';
import { createRequire } from 'module';
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
    
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        'original-name': file.originalname,
        'entity-type': entity_type,
        'entity-id': String(entity_id)
      }
    }).promise();
    
    const attachment = {
      id: Date.now(),
      filename: file.originalname,
      file_size: file.size,
      content_type: file.mimetype,
      entity_type,
      entity_id: parseInt(entity_id),
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
    
    const data = await s3.listObjectsV2({
      Bucket: BUCKET_NAME,
      Prefix: prefix
    }).promise();
    
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
    
    const data = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: key
    }).promise();
    
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
    comment.mentions.forEach(userId => {
      io.emit('mention:new', { userId, comment });
    });
  }
  
  res.json(comment);
});

// Get comments for entity
app.get('/api/v1/comments', (req, res) => {
  const { entity_type, entity_id } = req.query;
  
  let filtered = comments;
  if (entity_type && entity_id) {
    filtered = comments.filter(c => 
      c.entity_type === entity_type && 
      c.entity_id === parseInt(entity_id)
    );
  }
  
  res.json({ items: filtered, total: filtered.length });
});

// Update comment
app.patch('/api/v1/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = comments.findIndex(c => c.id === id);
  
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
  const id = parseInt(req.params.id);
  const index = comments.findIndex(c => c.id === id);
  
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
  const id = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === id);
  
  if (notification) {
    notification.is_read = true;
    io.emit('notification:read', { id });
  }
  
  res.json({ success: true });
});

// Mark all as read
app.patch('/api/v1/notifications/mark-all-read', (req, res) => {
  notifications.forEach(n => n.is_read = true);
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
  const { deal } = req.body;
  
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

async function startServer() {
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
}

startServer();
