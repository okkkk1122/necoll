import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import configRoutes from './routes/config.routes';
import productsRoutes from './routes/products.routes';
import categoriesRoutes from './routes/categories.routes';
import modulesRoutes from './routes/modules.routes';
import navigationRoutes from './routes/navigation.routes';
import businessRulesRoutes from './routes/business-rules.routes';
import chatRoutes from './routes/chat.routes';
import ordersRoutes from './routes/orders.routes';
import paymentRoutes from './routes/payment.routes';
import contactRoutes from './routes/contact.routes';
import pagesRoutes from './routes/pages.routes';
import uploadRoutes from './routes/upload.routes';
import blogRoutes from './routes/blog.routes';
import reviewsRoutes from './routes/reviews.routes';
import newsletterRoutes from './routes/newsletter.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests' },
});
app.use('/api/', limiter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Necoll HyperConfig Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/business-rules', businessRulesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Necoll Backend running on port ${PORT}`);
  console.log(`📡 HyperConfig System active`);
});
