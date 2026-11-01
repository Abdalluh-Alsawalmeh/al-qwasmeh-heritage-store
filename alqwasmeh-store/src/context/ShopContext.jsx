import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

const API_BASE_URL = 'https://al-qwasmeh-heritage-store.onrender.com';

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('alqwasmeh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('alqwasmeh_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alqwasmeh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fixImageUrl = (url) => {
    if (!url) return '/background.png';
    if (url.startsWith('http://localhost:5000')) {
      return url.replace('http://localhost:5000', API_BASE_URL);
    }
    if (url.startsWith('/uploads')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const result = await response.json();

      const rawProducts = Array.isArray(result) ? result : (result.data || []);

      const formattedProducts = rawProducts.map((item) => ({
        ...item,
        id: item._id || item.id,
        image: fixImageUrl(item.image),
        images: Array.isArray(item.images) ? item.images.map(fixImageUrl) : [fixImageUrl(item.image)]
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('تعذر جلب البيانات من الخادم:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('alqwasmeh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('alqwasmeh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('alqwasmeh_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alqwasmeh_user');
      localStorage.removeItem('alqwasmeh_token');
    }
  }, [user]);

  const addToCart = (product, size, color, quantity = 1) => {
    const productId = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find(
        (item) => (item._id || item.id) === productId && item.selectedSize === size && item.selectedColor === color
      );
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === productId && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, id: productId, selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size, color) => {
    setCart((prev) => prev.filter(
      (item) => !((item._id || item.id) === id && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (id, size, color, delta) => {
    setCart((prev) => prev.map((item) => {
      if ((item._id || item.id) === id && item.selectedSize === size && item.selectedColor === color) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    }));
  };

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.some((item) => (item._id || item.id) === productId);
      if (exists) return prev.filter((item) => (item._id || item.id) !== productId);
      return [...prev, { ...product, id: productId }];
    });
  };

  const isInWishlist = (id) => wishlist.some((item) => (item._id || item.id) === id);

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('alqwasmeh_token');
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const result = await response.json();
      if (result.success || response.ok) {
        const newProduct = result.data || result;
        const formatted = {
          ...newProduct,
          id: newProduct._id,
          image: fixImageUrl(newProduct.image),
          images: Array.isArray(newProduct.images) ? newProduct.images.map(fixImageUrl) : [fixImageUrl(newProduct.image)]
        };
        setProducts((prev) => [formatted, ...prev]);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('alqwasmeh_token');
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const result = await response.json();
      if (result.success || response.ok) {
        const updated = result.data || result;
        const formatted = {
          ...updated,
          id: updated._id,
          image: fixImageUrl(updated.image),
          images: Array.isArray(updated.images) ? updated.images.map(fixImageUrl) : [fixImageUrl(updated.image)]
        };
        setProducts((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? formatted : item))
        );
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // حذف فوري ومباشر دون نوافذ confirm أو alert
  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));

    try {
      const token = localStorage.getItem('alqwasmeh_token');
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok && !result.success) {
        console.error('فشل الحذف من الخادم:', result.message);
        fetchProducts();
      }
    } catch (error) {
      console.error('حدث خطأ أثناء محاولة الحذف:', error);
      fetchProducts();
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        cart,
        wishlist,
        user,
        setUser,
        logout,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthOpen,
        setIsAuthOpen,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        deleteProduct,
        addProduct,
        updateProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);