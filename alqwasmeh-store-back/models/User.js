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
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'صيغة البريد الإلكتروني غير صحيحة']
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
  this.password = await bcrypt.hash(this.password, 10);
});

// التحقق من كلمة المرور (حسابات Google بلا كلمة مرور ترجع false بدل رمي خطأ)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
