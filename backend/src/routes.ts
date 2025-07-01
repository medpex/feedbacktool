import { Router, Request, Response } from 'express';
import { pool } from './db';
import { Feedback, FeedbackLink } from './models';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Hilfsfunktion für Concern-Texte
function getConcernText(concern: string): string {
  const concernTexts: Record<string, string> = {
    'Internet-Freischaltung': 'Kürzlich wurde Ihr Internet freigeschaltet. Wie war Ihre Erfahrung mit unserem Service?',
    'Störung': 'Wir haben Ihre gemeldete Störung bearbeitet. Wie zufrieden sind Sie mit der Lösung?',
    'Servicebesuch': 'Unser Techniker war bei Ihnen vor Ort. Wie bewerten Sie den Servicebesuch?',
    'Beratung': 'Sie haben eine Beratung bei uns erhalten. Wie hilfreich war unser Beratungsgespräch?',
    'Rechnung': 'Bezüglich Ihrer Rechnungsanfrage: Wie zufrieden sind Sie mit der Bearbeitung?',
    'Kündigung': 'Ihre Kündigung wurde bearbeitet. Wie bewerten Sie unseren Kündigungsprozess?',
    'Sonstiges': 'Wie war Ihre Erfahrung mit unserem Service?'
  };
  return concernTexts[concern] || 'Wie war Ihre Erfahrung mit unserem Service?';
}

// POST /api/feedback-links
router.post('/feedback-links', async (req: Request, res: Response) => {
  const { customerNumber, concern, firstName, lastName } = req.body;
  
  if (!customerNumber || !concern || !firstName || !lastName) {
    return res.status(400).json({ success: false, error: 'Missing required fields: customerNumber, concern, firstName, lastName' });
  }
  
  const id = uuidv4();
  
  // Verwende die feste Domain für die Feedback-Links
  const baseUrl = 'https://feedback.home-ki.eu';
  
  // Kurzer Link - nur mit ref Parameter, alle anderen Daten werden über die Datenbank geladen
  const feedbackUrl = `${baseUrl}/?ref=${id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(feedbackUrl)}`;
  const createdAt = new Date().toISOString();
  
  try {
    await pool.query(
      `INSERT INTO feedback_links (id, customer_number, concern, first_name, last_name, feedback_url, qr_code_url, created_at, used)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, customerNumber, concern, firstName, lastName, feedbackUrl, qrCodeUrl, createdAt, false]
    );
    
    res.json({ 
      success: true, 
      data: { 
        id, 
        feedbackUrl, 
        qrCodeUrl, 
        concernText: getConcernText(concern), 
        createdAt 
      } 
    });
  } catch (err) {
    console.error('DB error (create feedback-link):', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Hilfsfunktion zum Mapping
function mapLinkRow(row: any): FeedbackLink {
  return {
    id: row.id,
    customer_number: row.customer_number,
    concern: row.concern,
    first_name: row.first_name,
    last_name: row.last_name,
    feedback_url: row.feedback_url,
    qr_code_url: row.qr_code_url,
    created_at: row.created_at,
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
    console.error('DB error (get feedback-links):', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/feedback-links/:id
router.get('/feedback-links/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM feedback_links WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Feedback link not found' });
    }
    res.json({ success: true, data: mapLinkRow(result.rows[0]) });
  } catch (err) {
    console.error('DB error (get feedback-link by id):', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// POST /api/feedback
router.post('/feedback', async (req: Request, res: Response) => {
  const { rating, comment, customer, customerName, concern, refId } = req.body;
  
  if (!rating || !refId) {
    return res.status(400).json({ success: false, error: 'Missing required fields: rating, refId' });
  }
  
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  
  try {
    await pool.query(
      `INSERT INTO feedback (id, rating, comment, timestamp, customer, customer_name, concern, ref_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, rating, comment || '', timestamp, customer || 'Anonymous', customerName || '', concern || '', refId]
    );
    
    // Mark link as used
    await pool.query('UPDATE feedback_links SET used = TRUE WHERE id = $1', [refId]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('DB error (feedback):', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/feedback
router.get('/feedback', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY timestamp DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('DB error (get feedback):', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// DELETE /api/feedback-links/:id
router.delete('/feedback-links/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Prüfe, ob Feedbacks mit ref_id existieren
    const feedbackResult = await pool.query('SELECT COUNT(*) FROM feedback WHERE ref_id = $1', [id]);
    if (parseInt(feedbackResult.rows[0].count, 10) > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Es existiert bereits Feedback zu diesem Link. Löschen nicht möglich.' 
      });
    }
    
    // Lösche den Link
    const result = await pool.query('DELETE FROM feedback_links WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Feedback link not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('DB error (delete feedback-link):', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

export default router;
