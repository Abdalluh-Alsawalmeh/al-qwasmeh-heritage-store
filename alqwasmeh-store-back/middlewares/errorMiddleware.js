export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // خطأ معرف غير صالح في Mongoose
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'العنصر المطلوب غير موجود (معرف غير صالح)';
  }

  // خطأ تكرار حقل فريد (مثل البريد)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'القيمة المدخلة مستخدمة بالفعل';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};