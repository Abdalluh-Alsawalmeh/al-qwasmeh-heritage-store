import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// التحقق من صحة التوكن وهوية المستخدم (Authentication)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول، يرجى تسجيل الدخول أولاً'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'المستخدم صاحب التوكن غير موجود' });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'التوكن غير صالح أو منتهي الصلاحية'
    });
  }
};

// فحص الصلاحيات بحسب الرتبة (Authorization: e.g. 'admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `المستخدم برتبة (${req.user.role}) لا يملك الصلاحيات الكافية لتنفيذ هذا الإجراء`
      });
    }
    next();
  };
};