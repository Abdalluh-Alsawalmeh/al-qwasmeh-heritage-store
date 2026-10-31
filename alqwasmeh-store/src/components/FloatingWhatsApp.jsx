import React from 'react';
import { BRAND_CONFIG } from '../data/products';

export const FloatingWhatsApp = () => {
  const whatsappUrl = `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent('مرحباً مطرزات القواسمة، أود الاستفسار عن تفصيل وتصاميم الأثواب المتوفرة لديكم.')}`;

  return (
    <aside aria-label="خدمة العملاء عبر واتساب" className="fixed bottom-6 left-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white pl-4 pr-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        {/* النص العربي بالخط العريض والواضح */}
        <span className="text-sm font-bold tracking-wide select-none text-white pt-0.5">
          تواصل معنا
        </span>

        {/* أيقونة واتساب الرسمية (الفقاعة الدائرية المفرغة بداخلها السماعة) */}
        <div className="w-7 h-7 flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.14 7.42L2 30l6.76-2.1c2.08 1.24 4.52 1.96 7.24 1.96 7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.54c-2.36 0-4.54-.66-6.4-1.82l-.46-.28-4.22 1.32 1.34-4.1-.3-.48C4.7 20.3 4.02 18.22 4.02 16c0-6.62 5.38-12 12-12s12 5.38 12 12-5.38 11.54-12 11.54zm6.58-8.64c-.36-.18-2.14-1.06-2.48-1.18-.32-.12-.56-.18-.8.18-.24.36-.92 1.18-1.12 1.42-.2.24-.4.26-.76.08-.36-.18-1.5-.56-2.86-1.78-1.06-.94-1.78-2.12-1.98-2.48-.2-.36-.02-.56.16-.74.16-.16.36-.4.54-.6.18-.2.24-.36.36-.6.12-.24.06-.44-.04-.62-.08-.18-.8-1.92-1.1-2.64-.3-.7-.58-.6-.8-.62h-.68c-.24 0-.62.08-.94.44-.32.36-1.24 1.22-1.24 2.98s1.28 3.46 1.46 3.7c.18.24 2.5 3.82 6.06 5.36.84.36 1.5.58 2.02.74.86.28 1.64.24 2.26.14.68-.1 2.14-.88 2.44-1.72.3-.84.3-1.56.22-1.72-.1-.16-.32-.26-.68-.44z" />
          </svg>
        </div>
      </a>
    </aside>
  );
};