import React from 'react';

export const AlQwasmehLogo = ({ inverted = false, className = "" }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src="/Al Qwasmeh Burgundy Embroidery Logo.png"
        alt="مطرزات القواسمة - Al Qwasmeh Embroidery"
        className={`w-auto transition-all duration-300 object-contain ${
          inverted
            // للفوتر (خلفية داكنة): يعكس الصورة أولاً ثم يدمجها بـ screen لإخفاء السواد وإبقاء الخطوط بيضاء ناصعة
            ? 'h-12 md:h-14 invert mix-blend-screen'
            // للهيدر (خلفية فاتحة): يدمج الأبيض ليصبح شفافاً ويبقى اللوجو بلونه الأصلي
            : 'h-12 md:h-16 mix-blend-multiply'
        }`}
      />
    </div>
  );
};