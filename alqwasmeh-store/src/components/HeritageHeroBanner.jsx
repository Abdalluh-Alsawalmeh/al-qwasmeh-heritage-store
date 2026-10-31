import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const HeritageHeroBanner = () => {
    return (
        <div className="w-full select-none overflow-hidden text-right">
            {/* قسم الصورة متجاوب الارتفاع */}
            <section className="relative w-full h-[52vh] sm:h-[68vh] md:h-[78vh] lg:h-[86vh] overflow-hidden flex items-center justify-center">

                {/* الصورة الأصلية */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                        src="/background.png"
                        alt="مجموعة الكوفية للتطريز التراثي"
                        className="w-full h-full object-cover object-[center_30%] sm:object-[center_35%] animate-slow-zoom will-change-transform"
                    />
                </div>

                {/* تدرجات الظل */}
                <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30"></div>

                {/* النصوص المتجاوبة */}
                <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-2.5 sm:space-y-4">
                    <span className="text-[#E7D6B8] text-[10px] sm:text-xs md:text-sm font-light tracking-[0.2em] sm:tracking-[0.25em] drop-shadow">
                        مجموعة التراث
                    </span>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg font-serif">
                        مجموعة الكوفية
                    </h1>

                    <div className="pt-1 sm:pt-2">
                        <Link
                            to="/products"
                            className="inline-block border border-white/90 hover:bg-white hover:text-[#25221F] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-xs text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-300 backdrop-blur-xs tracking-wider"
                        >
                            اكتشف المجموعة
                        </Link>
                    </div>

                </div>

            </section>

            {/* شريط الاقتباس التراثي البيج */}
            <div className="w-full bg-[#EBD8B8] py-3 sm:py-4 px-3 sm:px-4 text-center border-b border-[#dec59c]">
                <p className="text-[#3F3323] text-xs sm:text-sm md:text-base font-medium tracking-wide leading-relaxed">
                    أزياء تراثية فلسطينية مطرّزة يدوياً — كل قطعة فصل من ذاكرة شعب.
                </p>
            </div>
        </div>
    );
};