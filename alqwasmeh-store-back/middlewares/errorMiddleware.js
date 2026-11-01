const isProduction = process.env.NODE_ENV === 'production';

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'المسار المطلوب غير موجود' });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message;

  if (err.name === 'CastError') {
    if (err.path === '_id') {
      statusCode = 404;
      message = 'العنصر المطلوب غير موجود (معرف غير صالح)';
    } else {
      statusCode = 400;
      message = `قيمة غير صالحة للحقل (${err.path})`;
    }
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join('، ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'القيمة المدخلة مستخدمة بالفعل';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'صيغة البيانات المرسلة غير صحيحة';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'حجم البيانات المرسلة كبير جداً';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'حجم الصورة يجب ألا يتجاوز 5 ميغابايت' : 'تعذر معالجة الملف المرفوع';
  }

  if (statusCode >= 500) {
    console.error(err);
    if (isProduction) message = 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
