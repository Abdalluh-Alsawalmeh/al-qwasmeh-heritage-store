import { API_BASE_URL, STORAGE_KEYS } from '../config';
import { removeStorage } from '../utils/storage';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.token);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.token, token);
  } catch {
    // تجاهل
  }
};

export const clearToken = () => removeStorage(STORAGE_KEYS.token);

export const apiRequest = async (path, { method = 'GET', body, auth = false, signal } = {}) => {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let payload;
  if (body instanceof FormData) {
    payload = body; 
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: payload, signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً', 0);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || 'حدث خطأ أثناء المعالجة', response.status);
  }
  return data;
};
