import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CATEGORIES, BRAND_CONFIG } from './data/products';
import { Heart, Eye, X, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { AdminProductModal } from './components/AdminProductModal';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// مكون واجهة الصفحة الرئيسية
const HomePage = ({ onEditProduct, onOpenAddModal }) => {
  const { products, selectedCategory, setSelectedCategory, toggleWishlist, isInWishlist, user, deleteProduct } = useShop();
  const navigate = useNavigate();
  const isAdmin = user && user.role === 'admin';

  const filteredProducts = (products || []).filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  return (
    <>
      {/* قسم البانر مع الفيديو */}
      <section className="relative w-full min-h-[520px] md:min-h-[620px] flex items-center justify-center text-white text-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>

        <div className="absolute inset-0 bg-black/55 z-0 backdrop-blur-[0.5px]"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <span className="text-[#B59A67] text-xs font-semibold tracking-[0.25em] uppercase block mb-3 drop-shadow">
            دار القواسمة للتطريز التراثي
          </span>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-md">
            حين يحكي التطريز حكاية
          </h1>

          <p className="text-stone-200 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed drop-shadow">
            أثواب تحمل روح الهوية الفلسطينية والأردنية، مشغولة بحرفية الغرزة اليدوية وتفاصيل صُنعت لتبقى.
          </p>

          <Link
            to="/products"
            className="inline-block bg-[#B59A67] hover:bg-[#a68c5b] text-[#25221F] px-8 py-3.5 rounded-sm font-semibold text-sm transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            اكتشفي مجموعة الأثواب
          </Link>
        </div>
      </section>

      {/* لوحة تحكم الأدمن */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex justify-between items-center">
          <div className="bg-[#6D1F32]/10 text-[#6D1F32] px-4 py-2 rounded-lg text-xs font-bold border border-[#6D1F32]/20">
            لوحة تحكم الأدمن: أهلاً بك {user.name}
          </div>
          <button
            onClick={onOpenAddModal}
            className="bg-[#6D1F32] hover:bg-[#521726] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle size={17} />
            <span>إضافة ثوب جديد</span>
          </button>
        </div>
      )}

      {/* شريط الفئات */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 text-xs md:text-sm rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#6D1F32] text-white font-semibold'
                  : 'bg-white text-stone-700 hover:bg-[#EEE5D8] border border-[#EEE5D8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* شبكة المنتجات */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;
            const favorited = isInWishlist(productId);

            return (
              <div
                key={productId}
                className="bg-white rounded-lg overflow-hidden border border-[#EEE5D8] shadow-sm hover:shadow-md transition-shadow group flex flex-col relative"
              >
                <div
                  className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${productId}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNewProduct && (
                    <span className="absolute top-3 right-3 bg-[#9E2639] text-white text-[10px] font-bold px-2 py-1 rounded">
                      جديد
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-3 left-3 bg-white/90 hover:bg-white text-[#25221F] p-2 rounded-full shadow transition-colors z-10"
                    title={favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                  >
                    <Heart
                      size={16}
                      className={favorited ? 'fill-[#9E2639] text-[#9E2639]' : 'text-stone-600'}
                    />
                  </button>

                  {/* أزرار الأدمن */}
                  {isAdmin && (
                    <div className="absolute bottom-3 right-3 left-3 flex gap-2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product);
                        }}
                        className="flex-1 bg-white/95 hover:bg-white text-stone-900 py-1.5 rounded-md text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Edit2 size={13} className="text-blue-600" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(productId);
                        }}
                        className="bg-white/95 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-md shadow transition-all flex items-center justify-center"
                        title="حذف الثوب"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between text-right">
                  <div>
                    <span className="text-[11px] text-[#596247] font-semibold block mb-1">
                      {product.region}
                    </span>
                    <h3 className="font-bold text-base text-[#25221F] mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EEE5D8]">
                    <span className="text-base font-bold text-[#6D1F32]">
                      {product.price} {BRAND_CONFIG.currency}
                    </span>
                    <button
                      onClick={() => navigate(`/product/${productId}`)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#B59A67] hover:text-[#9E2639] transition-colors"
                    >
                      <Eye size={15} />
                      معاينة وتفصيل
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

// المكون الداخلي الرئيسي مع الـ Router
const MainContent = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity } = useShop();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [productEditing, setProductEditing] = useState(null);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F4EC]">
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenAddModal={() => {
                  setProductEditing(null);
                  setAdminModalOpen(true);
                }}
                onEditProduct={(p) => {
                  setProductEditing(p);
                  setAdminModalOpen(true);
                }}
              />
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
        </Routes>
      </main>

      {/* حقيبة الشراء (Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-bold text-base text-[#25221F]">حقيبة الشراء</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-stone-100 rounded text-stone-500"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center text-stone-400 text-sm">
                  الحقيبة فارغة حالياً
                </div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-[60vh] overflow-y-auto mt-4 pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-3 flex gap-3 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded border border-stone-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#25221F]">{item.name}</h4>
                          <span className="text-[11px] text-stone-500 block">
                            المقاس: {item.selectedSize} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                          </span>
                          <span className="text-xs font-bold text-[#6D1F32]">
                            {item.price} {BRAND_CONFIG.currency}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id || item.id, item.selectedSize, item.selectedColor, -1)}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id || item.id, item.selectedSize, item.selectedColor, 1)}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id || item.id, item.selectedSize, item.selectedColor)}
                          className="text-red-500 hover:text-red-700 mr-2 text-xs font-semibold"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-stone-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold">المجموع:</span>
                  <span className="text-lg font-bold text-[#6D1F32]">
                    {cartSubtotal} {BRAND_CONFIG.currency}
                  </span>
                </div>
                <a
                  href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                    `طلب جديد من المتجر:\n` +
                      cart
                        .map(
                          (i) =>
                            `- ${i.name} (${i.selectedSize}${i.selectedColor ? ` - ${i.selectedColor}` : ''}) × ${i.quantity} = ${i.price * i.quantity} ${BRAND_CONFIG.currency}`
                        )
                        .join('\n') +
                      `\nالمجموع: ${cartSubtotal} ${BRAND_CONFIG.currency}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded text-xs font-bold block text-center shadow-lg transition-colors"
                >
                  إرسال الطلب عبر واتساب
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نافذة الأدمن */}
      <AdminProductModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        productToEdit={productEditing}
      />

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