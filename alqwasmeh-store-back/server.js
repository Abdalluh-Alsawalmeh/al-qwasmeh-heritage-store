import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { UPLOAD_DIR } from './config/paths.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

// متغيرات البيئة الإلزامية — لا توجد قيم احتياطية للأسرار
const missing = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1); 
// CORS: قائمة النطاقات المسموحة من CORS_ORIGINS (مفصولة بفواصل)
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (allowedOrigins.length === 0 && isProduction) {
  console.warn('CORS_ORIGINS is not set: any website can call this API. Set it to your Vercel domain(s).');
}

app.use(cors({
  origin: allowedOrigins.length === 0
    ? true
    : (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        const error = new Error('Origin not allowed by CORS');
        error.statusCode = 403;
        callback(error);
      },
}));

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'no-referrer');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// إنشاء مجلد uploads تلقائياً وإتاحته كملفات ثابتة (أسماء الملفات عشوائية فريدة فيمكن تخزينها مؤقتاً)
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', (req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(UPLOAD_DIR, { index: false, maxAge: '30d', immutable: true }));

// مسارات الـ API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Al Qwasmeh Store API is running successfully...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
