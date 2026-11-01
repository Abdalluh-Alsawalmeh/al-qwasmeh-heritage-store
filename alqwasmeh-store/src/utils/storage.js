// قراءة آمنة من localStorage: JSON تالف أو بيانات بشكل غير متوقع تعيد القيمة الافتراضية ولا تكسر التطبيق
export const readStorage = (key, fallback, sanitize = (value) => value) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const result = sanitize(JSON.parse(raw));
    return result === undefined ? fallback : result;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // مساحة التخزين ممتلئة أو التصفح الخاص: نتجاهل الخطأ
  }
};

export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // تجاهل
  }
};
