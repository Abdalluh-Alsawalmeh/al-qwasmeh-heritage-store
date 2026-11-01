import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { AdminProductModal } from './components/AdminProductModal';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// العودة لأعلى الصفحة عند كل انتقال (وإلا يبقى موضع التمرير السابق)
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
};

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
    <h1 className="text-xl font-bold text-stone-800 mb-2">الصفحة المطلوبة غير موجودة</h1>
    <p className="text-xs text-stone-500 mb-6">يرجى التأكد من الرابط أو العودة إلى الصفحة الرئيسية.</p>
    <Link to="/" className="px-6 py-2.5 bg-[#6D1F32] hover:bg-[#521726] text-white rounded-lg text-xs font-bold transition-colors">
      العودة للرئيسية
    </Link>
  </div>
);

const MainContent = () => {
  // نافذة الأدمن تُركَّب فقط عند فتحها فتبدأ بنموذج جديد في كل مرة
  const [adminModal, setAdminModal] = useState({ open: false, product: null });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F4EC]">
      <ScrollToTop />
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenAddModal={() => setAdminModal({ open: true, product: null })}
                onEditProduct={(product) => setAdminModal({ open: true, product })}
              />
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <CartDrawer />

      {adminModal.open && (
        <AdminProductModal
          productToEdit={adminModal.product}
          onClose={() => setAdminModal({ open: false, product: null })}
        />
      )}

      <Footer />
      <FloatingWhatsApp />
      <AuthModal />
      <WishlistDrawer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
