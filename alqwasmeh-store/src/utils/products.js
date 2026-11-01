import { API_BASE_URL, FALLBACK_IMAGE } from '../config';

export const fixImageUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) return FALLBACK_IMAGE;
  const value = url.trim();
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(value)) {
    return value.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, API_BASE_URL);
  }
  if (value.startsWith('/uploads')) return `${API_BASE_URL}${value}`;
  return value;
};

// شكل موحد للمنتج القادم من الخادم: id ثابت + روابط صور مصححة
export const normalizeProduct = (item) => {
  const image = fixImageUrl(item.image);
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images.map(fixImageUrl)
    : [image];
  return { ...item, id: item._id || item.id, image, images };
};
