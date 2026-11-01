import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../data/products';

export const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        serviceType: 'general',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.message.trim()) return;

        const serviceLabels = {
            general: 'استفسار عام',
            custom_dress: 'طلب تفصيل ثوب خاص',
            sizes: 'استفسار عن المقاسات والأقمشة',
            wholesale: 'طلبات الجملة والمناسبات'
        };

        const whatsappMessage =
            `*رسالة جديدة عبر موقع دار القواسمة:*\n\n` +
            `👤 *الاسم:* ${formData.name}\n` +
            `📱 *رقم الهاتف:* ${formData.phone || 'غير محدد'}\n` +
            `🏷️ *نوع الطلب:* ${serviceLabels[formData.serviceType]}\n` +
            `📝 *نص الرسالة والاستفسار:*\n${formData.message}`;

        const whatsappUrl = `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right">
            {/* عنوان الصفحة */}
            <div className="text-center mb-12">
                <span className="text-[#B59A67] text-xs font-semibold tracking-widest uppercase block mb-2">
                    يسعدنا استقبال استفساراتكم
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#25221F] mb-3">
                    تواصل مع دار القواسمة
                </h1>
                <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
                    نحن في خدمتكم لأي استفسار حول جاهزية الأثواب، المقاسات الدقيقة، أو حجز مواعيد تفصيل الأثواب التراثية الخاصة للمناسبات.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* العمود الأيمن: نموذج المراسلة الفوري */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#EEE5D8] shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-[#EEE5D8] pb-4">
                        <MessageCircle className="text-[#6D1F32]" size={22} />
                        <h2 className="text-lg font-bold text-[#25221F]">أرسل طلبك أو استفسارك</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                الاسم الكريم <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#6D1F32] rounded-lg p-3 text-xs sm:text-sm text-right text-stone-800 outline-none transition-all placeholder:text-stone-400"
                                placeholder="الاسم الثلاثي أو الثنائي"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    رقم الهاتف (واتساب)
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#6D1F32] rounded-lg p-3 text-xs sm:text-sm text-right text-stone-800 outline-none transition-all placeholder:text-stone-400"
                                    placeholder="07xxxxxxxx"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    نوع الخدمة / الاستفسار
                                </label>
                                <select
                                    value={formData.serviceType}
                                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                    className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#6D1F32] rounded-lg p-3 text-xs sm:text-sm text-right text-stone-800 outline-none transition-all"
                                >
                                    <option value="general">استفسار عام</option>
                                    <option value="custom_dress">تفصيل ثوب خاص (غرزة يدوية)</option>
                                    <option value="sizes">استفسار عن القياس وتعديل الطول</option>
                                    <option value="wholesale">أثواب مناسبات وحفلات</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                تفاصيل الرسالة أو المقاسات المطلوبة <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#6D1F32] rounded-lg p-3 text-xs sm:text-sm text-right text-stone-800 outline-none transition-all placeholder:text-stone-400"
                                placeholder="اكتبي استفسارك، أو اسم الثوب المطلوب، أو تفاصيل المقاس واللون المفضل..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <Send size={16} />
                            <span>إرسال الاستفسار مباشرة عبر واتساب</span>
                        </button>
                    </form>
                </div>

                {/* العمود الأيسر: قنوات التواصل ومعلومات المتجر */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EEE5D8] shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-[#6D1F32] border-b border-[#EEE5D8] pb-3">
                            قنوات التواصل المباشرة
                        </h2>

                        {/* رقم الواتساب والهاتف */}
                        <div className="flex items-center gap-4 justify-end">
                            <div className="text-right">
                                <span className="text-[11px] text-stone-400 block font-medium">محادثة واتساب / هاتف</span>
                                <a
                                    href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-stone-800 hover:text-[#6D1F32] transition-colors"
                                >
                                    {BRAND_CONFIG.whatsappNumber}
                                </a>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] rounded-full text-[#6D1F32] border border-[#EEE5D8]">
                                <Phone size={19} />
                            </div>
                        </div>

                        {/* البريد الإلكتروني */}
                        <div className="flex items-center gap-4 justify-end">
                            <div className="text-right">
                                <span className="text-[11px] text-stone-400 block font-medium">البريد الإلكتروني للطلبات</span>
                                <span className="text-sm font-bold text-stone-800">
                                    alqwasmeh.heritage@gmail.com
                                </span>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] rounded-full text-[#6D1F32] border border-[#EEE5D8]">
                                <Mail size={19} />
                            </div>
                        </div>

                        {/* نطاق التوصيل والخدمة */}
                        <div className="flex items-center gap-4 justify-end">
                            <div className="text-right">
                                <span className="text-[11px] text-stone-400 block font-medium">التوصيل والشحن</span>
                                <span className="text-sm font-bold text-stone-800">
                                    شحن متوفر لكافة المحافظات وخارجها
                                </span>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] rounded-full text-[#6D1F32] border border-[#EEE5D8]">
                                <MapPin size={19} />
                            </div>
                        </div>
                    </div>

                    {/* بطاقة مواعيد العمل والضمان التراثي */}
                    <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EEE5D8] space-y-4">
                        <div className="flex items-center gap-2 text-[#6D1F32]">
                            <Clock size={18} />
                            <h3 className="text-xs font-bold">أوقات استقبال الطلبات</h3>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            خدمة الزبائن والمحادثات متوفرة يومياً من الساعة 10:00 صباحاً وحتى 10:00 مساءً للرد على القياسات وتأكيد الشحن.
                        </p>

                        <div className="flex items-center gap-2 text-[#596247] pt-2 border-t border-[#EEE5D8]">
                            <ShieldCheck size={18} />
                            <h3 className="text-xs font-bold">ضمان أصالة القطعة</h3>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            كل ثوب مشغول بدقة وحرفية يدوية تعكس التراث العريق، مع إمكانية التعديل والمعاينة عند الاستلام.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};