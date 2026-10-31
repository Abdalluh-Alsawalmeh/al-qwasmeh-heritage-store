import React from 'react';
import { AlQwasmehLogo } from './AlQwasmehLogo';
import { BRAND_CONFIG } from '../data/products';

export const Footer = () => {
  return (
    <footer className="bg-[#25221F] text-white pt-16 pb-8 border-t border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-right">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-12">

          <div>
            <AlQwasmehLogo inverted={true} />
            <p className="mt-4 text-xs text-stone-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              دار متخصصة في إحياء التراث الفلسطيني والأردني بتطريز يدوي متقن وخامات استثنائية تعكس أناقة المرأة العربية.
            </p>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-semibold text-[#B59A67] tracking-wider mb-4 uppercase">
              أصالة التطريز والتفصيل
            </h4>
            <p className="text-xs text-stone-300">
              إربد — المملكة الأردنية الهاشمية
            </p>
            <p className="text-xs text-stone-400 mt-1" dir="ltr">
              {BRAND_CONFIG.phone}
            </p>
          </div>

          {/* الأيقونات الاجتماعية الثلاث مع روابطها */}
          <div className="flex flex-col items-center md:items-end">
            <span className="text-xs text-[#B59A67] mb-3">تابعينا وتواصلي معنا</span>
            <div className="flex items-center gap-4">
              {/* فيسبوك */}
              <a
                href={BRAND_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="صفحة مطرزات القواسمة على فيسبوك"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#1877F2] text-white transition-colors"
                title="فيسبوك"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.5 0 9 1.5 9 4.667V8z" /></svg>
              </a>

              {/* انستغرام */}
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="حساب مطرزات القواسمة على انستغرام"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#E1306C] text-white transition-colors"
                title="انستغرام"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>

              {/* واتساب */}
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل مع مطرزات القواسمة مباشرة على واتساب"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#25D366] text-white transition-colors"
                title="واتساب"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
              </a>

            </div>
            <a
              href={`mailto:${BRAND_CONFIG.email}`}
              className="inline-block text-xs text-[#B59A67] hover:text-white transition-colors mt-2 underline"
              dir="ltr"
            >
              {BRAND_CONFIG.email}
            </a>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          جميع الحقوق محفوظة © {new Date().getFullYear()} مطرزات القواسمة.
        </div>

      </div>
    </footer>
  );
};