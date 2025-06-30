import { Router, Request, Response } from 'express';
import { pool } from './db';
import { Feedback, FeedbackLink } from './models';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/feedback-links
router.post('/feedback-links', async (req: Request, res: Response) => {
  console.log('POST /api/feedback-links body:', req.body);
  const { customerNumber, concern, firstName, lastName, feedbackUrl, qrCodeUrl } = req.body;
  if (!customerNumber || !concern || !firstName || !lastName || !feedbackUrl || !qrCodeUrl) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  try {
    await pool.query(
      `INSERT INTO feedback_links (id, customer_number, concern, first_name, last_name, feedback_url, qr_code_url, created_at, used)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, customerNumber, concern, firstName, lastName, feedbackUrl, qrCodeUrl, createdAt, false]
    );
    res.json({ success: true, data: { id, feedbackUrl, qrCodeUrl, concernText: concern, createdAt } });
  } catch (err) {
    console.error('DB error (feedback-links):', err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// Hilfsfunktion zum Mapping
function mapLinkRow(row: any) {
  return {
    id: row.id,
    customerNumber: row.customer_number,
    concern: row.concern,
    firstName: row.first_name,
    lastName: row.last_name,
    feedbackUrl: row.feedback_url,
    qrCodeUrl: row.qr_code_url,
    createdAt: row.created_at,
    used: row.used
  };
}

// GET /api/feedback-links
router.get('/feedback-links', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM feedback_links ORDER BY created_at DESC');
    const mapped = result.rows.map(mapLinkRow);
    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// GET /api/feedback-links/:id
router.get('/feedback-links/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM feedback_links WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: mapLinkRow(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// POST /api/feedback
router.post('/feedback', async (req: Request, res: Response) => {
  const { rating, comment, customer, customerName, concern, refId } = req.body;
  if (!rating || !refId) return res.status(400).json({ success: false, error: 'Missing fields' });
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  try {
    await pool.query(
      `INSERT INTO feedback (id, rating, comment, timestamp, customer, customer_name, concern, ref_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, rating, comment, timestamp, customer, customerName, concern, refId]
    );
    // Mark link as used
    await pool.query('UPDATE feedback_links SET used = TRUE WHERE id = $1', [refId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// GET /api/feedback
router.get('/feedback', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY timestamp DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

export default router; 