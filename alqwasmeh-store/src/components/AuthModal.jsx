import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { API_BASE_URL } from '../config';

export const AuthModal = () => {
    const { isAuthOpen, setIsAuthOpen, setUser } = useShop();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    if (!isAuthOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('alqwasmeh_token', data.token);
                setUser(data.user);
                setIsAuthOpen(false);
            } else {
                setError(data.message || 'حدث خطأ أثناء المعالجة');
            }
        } catch {
            setError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('alqwasmeh_token', data.token);
                setUser(data.user);
                setIsAuthOpen(false);
            } else {
                setError(data.message || 'فشل تسجيل الدخول بحساب Google');
            }
        } catch {
            setError('حدث خطأ أثناء التواصل مع خادم الباك إند');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-right shadow-2xl relative border border-stone-100">

                <button
                    onClick={() => setIsAuthOpen(false)}
                    className="absolute top-5 left-5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#25221F]">
                        {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                        {isLogin ? 'أهلاً بكِ مجدداً في دار مطرزات القواسمة' : 'انضمي إلينا واستمتعي بتجربة تراثية فريدة'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">الاسم الكامل</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="سارة القواسمة"
                                    className="w-full border border-stone-200 rounded-lg py-2.5 pr-9 pl-3 text-xs outline-none focus:border-[#6D1F32]"
                                />
                                <UserIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">البريد الإلكتروني</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="example@mail.com"
                                className="w-full border border-stone-200 rounded-lg py-2.5 pr-9 pl-3 text-xs outline-none focus:border-[#6D1F32]"
                                dir="ltr"
                            />
                            <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full border border-stone-200 rounded-lg py-2.5 pr-9 pl-3 text-xs outline-none focus:border-[#6D1F32]"
                                dir="ltr"
                            />
                            <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6D1F32] hover:bg-[#521726] text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : isLogin ? 'دخول' : 'تسجيل حساب'}
                    </button>
                </form>

                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-stone-400">أو من خلال</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('فشل تسجيل الدخول عبر Google')}
                        theme="outline"
                        shape="pill"
                        locale="ar"
                        text={isLogin ? 'signin_with' : 'signup_with'}
                    />
                </div>

                <div className="text-center mt-6 pt-4 border-t border-stone-100 text-xs text-stone-600">
                    {isLogin ? 'ليس لديكِ حساب بعد؟' : 'لديكِ حساب بالفعل؟'}{' '}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-[#6D1F32] font-bold hover:underline"
                    >
                        {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                    </button>
                </div>

            </div>
        </div>
    );
};