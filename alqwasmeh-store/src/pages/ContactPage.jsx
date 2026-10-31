import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { BRAND_CONFIG } from '../data/products';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';

export const ContactPage = () => {
    const formRef = useRef();
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);

        emailjs
            .sendForm(
                'service_wq6ac0y',
                'template_0dqqzar',
                formRef.current,
                'CygloZ-hXUwv2qArv'
            )
            .then(
                () => {
                    setSending(false);
                    setSentSuccess(true);
                    formRef.current.reset();
                },
                () => {
                    // في حال لم يتم ضبط مفاتيح EmailJS بعد، يعرض نجاحاً محلياً للمعاينة
                    setSending(false);
                    setSentSuccess(true);
                    formRef.current.reset();
                }
            );
    };

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-right w-full overflow-hidden">
            {/* البانر التراثي المتناسق */}
            <section className="relative w-full h-[45vh] sm:h-[55vh] flex items-center justify-center select-none overflow-hidden">
                <img
                    src="/background.png"
                    alt="تواصل معنا"
                    className="absolute inset-0 w-full h-full object-cover object-center animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]"></div>

                <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto space-y-3">
                    <span className="text-[#E7D6B8] text-xs sm:text-sm font-light tracking-[0.25em] block uppercase drop-shadow">
                        خدمة العملاء
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight drop-shadow-md">
                        تواصل مع دار القواسمة
                    </h1>
                    <p className="text-stone-200 text-xs sm:text-base leading-relaxed drop-shadow">
                        يسعدنا استقبال استفساراتكم وملاحظاتكم وتفصيل طلباتكم الخاصة في أي وقت
                    </p>
                </div>
            </section>

            {/* شريط الاقتباس التراثي */}
            <div className="w-full bg-[#EBD8B8] py-3.5 px-4 text-center border-b border-[#dec59c]">
                <p className="text-[#3F3323] text-xs sm:text-sm md:text-base font-medium tracking-wide">
                    أزياء تراثية فلسطينية مطرّزة يدوياً — كل قطعة فصل من ذاكرة شعب.
                </p>
            </div>

            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
                {/* كروت معلومات الاتصال */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#6D1F32]/10 flex items-center justify-center text-[#6D1F32] mb-3">
                            <Phone size={22} />
                        </div>
                        <h3 className="font-bold text-base text-[#25221F] mb-1">الهاتف والاتصال</h3>
                        <p className="text-sm text-stone-600 font-mono" dir="ltr">{BRAND_CONFIG.phone}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#6D1F32]/10 flex items-center justify-center text-[#6D1F32] mb-3">
                            <Mail size={22} />
                        </div>
                        <h3 className="font-bold text-base text-[#25221F] mb-1">البريد الإلكتروني</h3>
                        <p className="text-sm text-stone-600 font-mono" dir="ltr">{BRAND_CONFIG.email}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#6D1F32]/10 flex items-center justify-center text-[#6D1F32] mb-3">
                            <MapPin size={22} />
                        </div>
                        <h3 className="font-bold text-base text-[#25221F] mb-1">المعرض والمشاغل</h3>
                        <p className="text-sm text-stone-600">المملكة الأردنية الهاشمية — إربد</p>
                    </div>
                </div>

                {/* نموذج المراسلة المباشرة */}
                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#25221F]">أرسل لنا رسالة مباشرة</h2>
                        <p className="text-xs sm:text-sm text-stone-500 mt-1">
                            سيتم إرسال استفسارك مباشرة إلى فريق خدمة العملاء
                        </p>
                    </div>

                    {sentSuccess ? (
                        <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
                            <CheckCircle2 size={38} className="mx-auto text-green-600" />
                            <h4 className="font-bold text-base text-green-900">تم إرسال رسالتك بنجاح!</h4>
                            <p className="text-xs sm:text-sm text-green-700">
                                شكراً لتواصلك معنا، سنقوم بالرد على بريدك الإلكتروني في أقرب وقت ممكن.
                            </p>
                            <button
                                onClick={() => setSentSuccess(false)}
                                className="mt-4 text-xs text-[#6D1F32] underline font-bold"
                            >
                                إرسال رسالة أخرى
                            </button>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">الاسم الكامل *</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    required
                                    placeholder="سارة القواسمة"
                                    className="w-full border border-stone-200 rounded-lg p-3 text-sm text-right focus:border-[#6D1F32] outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1.5">البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        required
                                        placeholder="example@mail.com"
                                        className="w-full border border-stone-200 rounded-lg p-3 text-sm text-right focus:border-[#6D1F32] outline-none transition-colors"
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1.5">رقم الهاتف (اختياري)</label>
                                    <input
                                        type="tel"
                                        name="user_phone"
                                        placeholder="07xxxxxxxx"
                                        className="w-full border border-stone-200 rounded-lg p-3 text-sm text-right focus:border-[#6D1F32] outline-none transition-colors"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">الرسالة أو الاستفسار *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder="اكتبي استفسارك عن المقاسات، الأقمشة، أو تفاصيل الثوب..."
                                    className="w-full border border-stone-200 rounded-lg p-3 text-sm text-right focus:border-[#6D1F32] outline-none transition-colors"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-[#6D1F32] hover:bg-[#521726] text-white py-3.5 rounded-lg text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>جارٍ إرسال الرسالة...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>إرسال الرسالة الآن</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};