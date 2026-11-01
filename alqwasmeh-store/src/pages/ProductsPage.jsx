import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, BRAND_CONFIG } from '../data/products';
import { Heart, Eye, SearchX, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ProductsPage = () => {
    const { products, toggleWishlist, isInWishlist } = useShop();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentCategory = searchParams.get('category') || 'all';
    const currentSearch = searchParams.get('search') || '';

    // إعدادات الترقيم (Pagination)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // العودة للصفحة الأولى عند تغير الفئة أو نص البحث
    useEffect(() => {
        setCurrentPage(1);
    }, [currentCategory, currentSearch]);

    // تصفية المنتجات بناءً على التصنيف + نص البحث
    const filteredProducts = (products || []).filter((p) => {
        const matchesCategory = currentCategory === 'all' ? true : p.category === currentCategory;
        if (!currentSearch.trim()) return matchesCategory;

        const query = currentSearch.toLowerCase().trim();
        const nameMatch = p.name ? p.name.toLowerCase().includes(query) : false;
        const descMatch = p.description ? p.description.toLowerCase().includes(query) : false;
        const regionMatch = p.region ? p.region.toLowerCase().includes(query) : false;
        const fabricMatch = p.fabric ? p.fabric.toLowerCase().includes(query) : false;
        const embroideryMatch = p.embroideryType ? p.embroideryType.toLowerCase().includes(query) : false;

        return matchesCategory && (nameMatch || descMatch || regionMatch || fabricMatch || embroideryMatch);
    });

    // حساب عدد الصفحات (حد أدنى 1 لتفادي الإخفاء)
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const clearFilters = () => {
        setSearchParams({});
        setCurrentPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
            {/* عنوان الصفحة ونتائج البحث إن وجدت */}
            <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#25221F]">
                    {currentSearch ? `نتائج البحث عن: "${currentSearch}"` : 'تشكيلة الأثواب الفاخرة'}
                </h1>
                {currentSearch && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-xs text-stone-500">تم العثور على {filteredProducts.length} قطعة</span>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-xs text-[#6D1F32] hover:underline font-semibold"
                        >
                            <RotateCcw size={12} />
                            <span>إلغاء البحث والعودة للكل</span>
                        </button>
                    </div>
                )}
            </div>

            {/* شريط الفئات */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            const newParams = {};
                            if (cat.id !== 'all') newParams.category = cat.id;
                            if (currentSearch) newParams.search = currentSearch;
                            setSearchParams(newParams);
                        }}
                        className={`px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm rounded-full transition-colors whitespace-nowrap shrink-0 ${currentCategory === cat.id
                                ? 'bg-[#6D1F32] text-white font-semibold shadow-xs'
                                : 'bg-white text-stone-700 hover:bg-[#EEE5D8] border border-[#EEE5D8]'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* في حال عدم العثور على أي نتيجة مطابقة */}
            {filteredProducts.length === 0 ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-stone-200 mt-6 shadow-xs max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                        <SearchX size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 mb-1">عذراً، لم نجد أي ثوب يطابق بحثك</h3>
                    <p className="text-xs text-stone-500 mb-6">
                        جرّب البحث بكلمات أخرى أو عرض كافة التشكيلات المتوفرة.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-2.5 bg-[#6D1F32] hover:bg-[#521726] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                        عرض كافة الأثواب
                    </button>
                </div>
            ) : (
                <>
                    {/* شبكة المنتجات المعروضة في الصفحة الحالية */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 pt-4">
                        {currentItems.map((product) => {
                            const productId = product._id || product.id;
                            const favorited = isInWishlist(productId);

                            return (
                                <div key={productId} className="bg-white rounded-lg overflow-hidden border border-[#EEE5D8] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                                    <div
                                        className="relative aspect-[3/4] bg-stone-100 cursor-pointer overflow-hidden group"
                                        onClick={() => navigate(`/product/${productId}`)}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/background.png';
                                            }}
                                        />
                                        {product.isNewProduct && (
                                            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#9E2639] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded">
                                                جديد
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(product);
                                            }}
                                            className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 p-1.5 sm:p-2 rounded-full shadow-xs"
                                            title="المفضلة"
                                        >
                                            <Heart size={14} className={favorited ? 'fill-[#9E2639] text-[#9E2639]' : 'text-stone-600 sm:w-4 sm:h-4'} />
                                        </button>
                                    </div>

                                    <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between text-right">
                                        <div>
                                            <span className="text-[10px] sm:text-[11px] text-[#596247] font-semibold block mb-0.5">{product.region}</span>
                                            <h3 className="font-bold text-xs sm:text-base text-[#25221F] mb-1 line-clamp-1">{product.name}</h3>
                                            <p className="hidden sm:block text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">{product.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#EEE5D8]">
                                            <span className="text-xs sm:text-base font-bold text-[#6D1F32]">{product.price} {BRAND_CONFIG.currency}</span>
                                            <button
                                                onClick={() => navigate(`/product/${productId}`)}
                                                className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#B59A67] hover:text-[#9E2639]"
                                            >
                                                <Eye size={13} className="sm:w-3.5 sm:h-3.5" />
                                                <span>تفصيل</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* أزرار الترقيم تظهر في كل الأحوال للتنقل والتحكم */}
                    <div className="flex items-center justify-center gap-2 pt-10">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="الصفحة السابقة"
                        >
                            <ChevronRight size={18} />
                        </button>

                        <div className="flex gap-1.5">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                                            ? 'bg-[#6D1F32] text-white shadow-xs'
                                            : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="الصفحة التالية"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};