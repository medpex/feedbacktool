import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

// @ts-ignore
import type {} from 'node';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api', router);

// TODO: API-Routen für Feedback und Links

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 