import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

// دالة إنشاء JWT Token موحدة لجميع أنواع الدخول
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    إنشاء حساب جديد
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    // استخراج الاسمين حتى لو أرسل الفرونت اسماً واحداً
    const fName = firstName || (name ? name.split(' ')[0] : 'مستخدم');
    const lName = lastName || (name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : 'جديد');

    const user = await User.create({
      firstName: fName,
      lastName: lName,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: 'customer'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    تسجيل الدخول (بالبريد أو رقم الهاتف)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = (identifier || email || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'يرجى تقديم البريد/الهاتف وكلمة المرور' });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier.toLowerCase() }, { phone: loginIdentifier }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب بيانات المستخدم المسجل حالياً
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    تسجيل الدخول أو التسجيل التلقائي عبر Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'بيانات الاعتماد غير موجودة' });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const { email, name, given_name, family_name, picture, sub: googleId } = payload;

    // استخراج الاسم الأول والأخير بدقة من بيانات Google
    const firstName = (given_name || (name ? name.split(' ')[0] : 'مستخدم')).trim();
    const lastName = (
      family_name || (name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : 'الزائر')
    ).trim();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        role: 'customer',
        avatar: picture || '',
        googleId,
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        avatar: user.avatar || picture || '',
      },
    });
  } catch (error) {
    console.error('Google Auth Controller Error:', error.message);
    return res.status(401).json({
      success: false,
      message: error.message || 'فشل التحقق من Google',
    });
  }
};