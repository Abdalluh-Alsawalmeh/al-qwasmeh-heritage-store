import { BRAND_CONFIG } from '../data/products';

// رابط واتساب مع نص مُرمَّز (يدعم العربية والرموز الخاصة)
export const whatsappUrl = (text) =>
  `https://wa.me/${BRAND_CONFIG.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
