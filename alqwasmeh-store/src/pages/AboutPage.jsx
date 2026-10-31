import React from 'react';
import { HeritageHeroBanner } from '../components/HeritageHeroBanner';
import { Award, Sparkles, HeartHandshake } from 'lucide-react';

export const AboutPage = () => {
    return (
        <div className="bg-[#FAF8F5] min-h-screen text-right">
            {/* البانر الكامل مع الانبثاق والشريط السفلي */}
            <HeritageHeroBanner />

            {/* محتوى قصة وهوية الدار */}
            <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xs leading-relaxed text-stone-700 text-sm sm:text-base space-y-4">
                    <h2 className="text-2xl font-bold text-[#6D1F32]">أصالة الغرزة ونبض الهوية</h2>
                    <p>
                        تأسست دار مطرزات القواسمة كوجهة متخصصة في إحياء التراث الفلسطيني والأردني العريق المروي بخيوط الحرير والغرز اليدوية المتقنة. نؤمن بأن الثوب التراثي ليس مجرد قطعة لباس عابرة، بل هو ذاكرة حية، وهوية وطنية، وتاريخ يحاك بكل فخر واعتزاز.
                    </p>
                    <p>
                        نحرص على انتقاء أفخر خامات أقمشة الكتان الملكي والمخمل، ونعمل بحرفية دقيقة تتبع الأنماط التاريخية لثياب المدن والقرى الأصيلة (كالقدس، رام الله، الخليل، وبئر السبع).
                    </p>
                </div>

                {/* مميزات العمل والحرفية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#6D1F32]/10 flex items-center justify-center text-[#6D1F32]">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="font-bold text-[#25221F] text-base">غرزة يدوية متقنة</h3>
                        <p className="text-xs text-stone-500 leading-relaxed">
                            تطريز يدوي أصيل بخيوط مختارة بعناية تدوم لسنوات وتتوارثها الأجيال.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#6D1F32]/10 flex items-center justify-center text-[#6D1F32]">
                            <Award size={24} />
                        </div>
                        <h3 className="font-bold text-[#25221F] text-base">أقمشة فاخرة</h3>
                        <p className="text-xs text-stone-500 leading-relaxed">
                            أقمشة كتان ومخمل طبيعية مختارة خصيصاً لتوفر أعلى درجات الراحة والفخامة.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#6D1F32]/10 flex items-center justify-center text-[#6D1F32]">
                            <HeartHandshake size={24} />
                        </div>
                        <h3 className="font-bold text-[#25221F] text-base">تفصيل خاص حسب الطلب</h3>
                        <p className="text-xs text-stone-500 leading-relaxed">
                            إمكانية تعديل القياسات والألوان لتناسب ذوقك ومناسباتك الخاصة.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};