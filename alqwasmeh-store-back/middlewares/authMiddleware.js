import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// التحقق من صحة التوكن وهوية المستخدم (Authentication)
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (!token || scheme.toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول، يرجى تسجيل الدخول أولاً',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'المستخدم صاحب التوكن غير موجود' });
    }

    req.user = user;
    next();
  } catch (error) {
    // أخطاء JWT فقط تعني توكن غير صالح؛ غيرها (مثل قاعدة البيانات) تمر لمعالج الأخطاء
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'التوكن غير صالح أو منتهي الصلاحية',
      });
    }
    next(error);
  }
};

// فحص الصلاحيات بحسب الرتبة (Authorization: e.g. 'admin')
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'لا تملك الصلاحيات الكافية لتنفيذ هذا الإجراء',
    });
  }
  next();
};
