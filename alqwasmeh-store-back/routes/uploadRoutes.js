import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import multer from 'multer';
import { UPLOAD_DIR } from '../config/paths.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

// تحديد نوع الصورة الفعلي من أول بايتات الملف (لا نثق بالامتداد ولا بـ mimetype القادم من العميل)
const detectImageExtension = (buffer) => {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return '.jpg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return '.webp';
  return null;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    const error = new Error('يرجى رفع صور فقط (jpg, png, webp)!');
    error.statusCode = 400;
    cb(error);
  },
});

const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  message: 'عدد كبير من عمليات الرفع، يرجى المحاولة بعد قليل',
});

// مسار رفع صورة واحدة — للأدمن فقط (التحقق من الهوية قبل استقبال الملف)
router.post('/', protect, authorize('admin'), uploadLimiter, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم اختيار أي ملف' });
    }

    const extension = detectImageExtension(req.file.buffer);
    if (!extension) {
      return res.status(400).json({ success: false, message: 'الملف المرفوع ليس صورة صالحة (jpg, png, webp)' });
    }

    // اسم عشوائي فريد: لا تعارض بين الملفات ولا يتأثر باسم الملف الأصلي
    const filename = `image-${crypto.randomUUID()}${extension}`;
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, filename), req.file.buffer, { flag: 'wx' });

    const baseUrl = (process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    res.status(200).json({ success: true, imageUrl: `${baseUrl}/uploads/${filename}` });
  } catch (error) {
    next(error);
  }
});

export default router;
