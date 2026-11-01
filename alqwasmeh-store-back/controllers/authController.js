import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { generateToken, serializeUser } from '../utils/auth.js';

const asString = (value) => (typeof value === 'string' ? value.trim() : '');

const splitName = (firstName, lastName, name, fallbackFirst, fallbackLast) => {
  const parts = name ? name.split(/\s+/) : [];
  return {
    first: firstName || parts[0] || fallbackFirst,
    last: lastName || parts.slice(1).join(' ') || fallbackLast,
  };
};

const sendAuth = (res, status, user) =>
  res.status(status).json({ success: true, token: generateToken(user._id), user: serializeUser(user) });

// @desc    إنشاء حساب جديد
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const email = asString(req.body.email).toLowerCase();
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'يرجى تقديم البريد الإلكتروني وكلمة المرور' });
    }
    if (password.length < 6 || password.length > 100) {
      return res.status(400).json({ success: false, message: 'يجب أن تتراوح كلمة المرور بين 6 و100 خانة' });
    }

    if (await User.exists({ email })) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    // استخراج الاسمين حتى لو أرسل الفرونت اسماً واحداً
    const { first, last } = splitName(
      asString(req.body.firstName),
      asString(req.body.lastName),
      asString(req.body.name),
      'مستخدم',
      'جديد'
    );

    const user = await User.create({
      firstName: first,
      lastName: last,
      email,
      phone: asString(req.body.phone),
      password,
      role: 'customer', // لا يمكن إنشاء أدمن من هذا المسار
    });

    sendAuth(res, 201, user);
  } catch (error) {
    next(error);
  }
};

// @desc    تسجيل الدخول (بالبريد أو رقم الهاتف)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const identifier = asString(req.body.identifier) || asString(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'يرجى تقديم البريد/الهاتف وكلمة المرور' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    sendAuth(res, 200, user);
  } catch (error) {
    next(error);
  }
};

// @desc    جلب بيانات المستخدم المسجل حالياً
// @route   GET /api/auth/me
// @access  Private
export const getMe = (req, res) => {
  res.status(200).json({ success: true, user: serializeUser(req.user) });
};

// @desc    تسجيل الدخول أو التسجيل التلقائي عبر Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const credential = asString(req.body.credential);

    if (!clientId) {
      return res.status(503).json({ success: false, message: 'تسجيل الدخول عبر Google غير مُفعّل على الخادم' });
    }
    if (!credential) {
      return res.status(400).json({ success: false, message: 'بيانات الاعتماد غير موجودة' });
    }

    let payload;
    try {
      const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: credential, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ success: false, message: 'فشل التحقق من حساب Google' });
    }

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني في حساب Google غير موثّق' });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      const { first, last } = splitName(
        asString(payload.given_name),
        asString(payload.family_name),
        asString(payload.name),
        'مستخدم',
        'الزائر'
      );
      user = await User.create({
        firstName: first,
        lastName: last,
        email,
        role: 'customer',
        avatar: payload.picture || '',
        googleId: payload.sub,
      });
    }

    sendAuth(res, 200, user);
  } catch (error) {
    next(error);
  }
};
