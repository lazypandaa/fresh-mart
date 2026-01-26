import express, { type Request, type Response } from 'express';
import cors from 'cors';
import emailRoutes from './routes/email.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.use('/api/email', emailRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'email-service' });
});

app.listen(PORT, () => {
  console.log(`✉️  Email service running on port ${PORT}`);
});