import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'يرجى إدخال الاسم الأول'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'يرجى إدخال الاسم الأخير'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'يرجى إدخال البريد الإلكتروني'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'صيغة البريد الإلكتروني غير صحيحة']
    },
    phone: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: function () {
        // كلمة المرور مطلوبة فقط إذا لم يكن الحساب مسجلاً عبر Google
        return !this.googleId;
      },
      minlength: [6, 'يجب أن لا تقل كلمة المرور عن 6 خانات'],
      select: false // لا تعاد كلمة المرور في استعلامات البحث افتراضياً
    },
    avatar: {
      type: String,
      default: ''
    },
    googleId: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    }
  },
  { timestamps: true }
);

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// دالة التحقق من صحة كلمة المرور عند تسجيل الدخول
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;