const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || 'https://al-qwasmeh-heritage-store.onrender.com'
);

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '735196108551-qr6skg1f6v8i3cgk898st12v9ikkpgc5.apps.googleusercontent.com';

export const STORAGE_KEYS = {
  cart: 'alqwasmeh_cart',
  wishlist: 'alqwasmeh_wishlist',
  user: 'alqwasmeh_user',
  token: 'alqwasmeh_token',
};

export const FALLBACK_IMAGE = '/background.png';
