import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// تحديد مكان حفظ الصور وتسميتها باسم فريد
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// التحقق من نوع الملف (صور فقط)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('يرجى رفع صور فقط (jpg, jpeg, png, webp)!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// مسار رفع صورة واحدة
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'لم يتم اختيار أي ملف' });
  }
  // إرجاع الرابط النظيف للصورة
  const filePath = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    imageUrl: filePath
  });
});

export default router;