import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Truck, Ruler, Plus, Minus, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/products';

export const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading, addToCart, toggleWishlist, isInWishlist } = useShop();

    // البحث عن الثوب المطلوب مع معالجة أنواع المعرفات
    const product = (products || []).find((p) => {
        const prodId = p._id || p.id;
        return String(prodId).trim() === String(id).trim();
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setCurrentImageIndex(0);
            setSelectedSize(product.sizes?.[0] || 'M');
            const defaultCol = Array.isArray(product.colors) && product.colors.length > 0
                ? product.colors[0]
                : (product.colors || 'افتراضي');
            setSelectedColor(defaultCol);
            setQuantity(1);
        }
    }, [product]);

    // 1. أثناء تحميل المنتجات من الباك إند
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F5]">
                <Loader2 size={40} className="animate-spin text-[#6D1F32] mb-3" />
                <p className="text-sm font-semibold text-stone-600">جارٍ جلب تفاصيل الثوب...</p>
            </div>
        );
    }

    // 2. إذا انتهى التحميل ولم يتم العثور على القطعة
    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F5]">
                <h2 className="text-xl font-bold text-stone-800 mb-2">الثوب المطلوب غير متوفر</h2>
                <p className="text-xs text-stone-500 mb-6">يرجى التأكد من الرابط أو استعراض باقي التشكيلات المتاحة.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2.5 bg-[#6D1F32] hover:bg-[#521726] text-white rounded-lg text-xs font-bold transition-colors"
                >
                    العودة لصفحة الأثواب
                </button>
            </div>
        );
    }

    const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const favorited = isInWishlist(product._id || product.id);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    };

    const handleBuyNow = () => {
        const message = `مرحباً مطرزات القواسمة، أود طلب الثوب التالي فوراً:
- اسم القطعة: ${product.name}
- المقاس المختار: ${selectedSize}
- اللون المختار: ${selectedColor}
- الكمية: ${quantity}
- السعر الإجمالي: ${product.price * quantity} ${BRAND_CONFIG.currency}
- نوع القماش: ${product.fabric || 'كتان'}
- نوع التطريز: ${product.embroideryType || 'تطريز يدوي'}`;

        const whatsappUrl = `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-8 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2 text-stone-600 hover:text-[#6D1F32] text-sm mb-6 font-semibold transition-colors"
                >
                    <ArrowRight size={18} />
                    العودة لكافة الأثواب
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
                    {/* قسم الصور */}
                    <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-3">
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:w-20 shrink-0">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`aspect-[2/3] w-16 md:w-full rounded-md overflow-hidden border-2 transition-all ${
                                        currentImageIndex === idx
                                            ? 'border-[#6D1F32] shadow-sm'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 bg-stone-100 rounded-xl overflow-hidden shadow-sm relative aspect-[2/3] max-h-[620px] w-full select-none border border-stone-200">
                            <img
                                src={productImages[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover object-top transition-all duration-300"
                            />
                            {productImages.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        aria-label="الصورة السابقة"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#25221F] shadow flex items-center justify-center transition-all opacity-85 hover:opacity-100 active:scale-95"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        aria-label="الصورة التالية"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#25221F] shadow flex items-center justify-center transition-all opacity-85 hover:opacity-100 active:scale-95"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                                        {currentImageIndex + 1} / {productImages.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* قسم التفاصيل */}
                    <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-stone-200 text-right shadow-xs">
                        <div className="border-b border-stone-100 pb-5">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#25221F] mb-2">{product.name}</h1>
                            <p className="text-2xl font-bold text-[#6D1F32]">{product.price} {BRAND_CONFIG.currency}</p>
                        </div>

                        <div className="py-5 space-y-2.5 text-sm text-stone-700 border-b border-stone-100">
                            <div><span className="font-bold text-stone-900">نوع القماش: </span>{product.fabric || 'كتان فاخر'}</div>
                            <div><span className="font-bold text-stone-900">نوع التطريز: </span>{product.embroideryType || 'تطريز يدوي متقن'}</div>
                            <div><span className="font-bold text-stone-900">ألوان التطريز: </span>{product.embroideryColor || 'ألوان متعددة وزاهية'}</div>
                        </div>

                        <p className="py-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-b border-stone-100">
                            {product.description}
                        </p>

                        {/* اختيار اللون */}
                        {product.colors && (
                            <div className="py-4 border-b border-stone-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-stone-800">
                                        اللون المختار: <span className="text-[#6D1F32] font-semibold">{selectedColor}</span>
                                    </span>
                                    {Array.isArray(product.colors) && product.colors.length > 1 && (
                                        <span className="text-[11px] text-stone-400">انقري لتحديد اللون</span>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {Array.isArray(product.colors) ? (
                                        product.colors.map((color) => {
                                            const isSelected = selectedColor === color;
                                            return (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? 'bg-[#6D1F32] text-white shadow-xs'
                                                            : 'bg-[#F8F4EC] text-stone-700 border border-[#EEE5D8] hover:border-stone-400'
                                                    }`}
                                                >
                                                    {isSelected && <Check size={13} />}
                                                    <span>{color}</span>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <span className="px-3 py-1.5 rounded-md bg-[#F8F4EC] text-[#25221F] border border-[#EEE5D8] text-xs font-medium">
                                            {product.colors}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* المقاسات */}
                        <div className="py-4 border-b border-stone-100">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-stone-800">المقاسات:</label>
                                <button className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-[#6D1F32]">
                                    <Ruler size={13} />
                                    دليل المقاسات
                                </button>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes?.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-11 h-9 rounded text-xs font-bold border transition-all flex items-center justify-center ${
                                            selectedSize === size
                                                ? 'border-[#6D1F32] bg-[#6D1F32] text-white shadow-xs'
                                                : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* عداد الكمية وأزرار الشراء */}
                        <div className="pt-5 space-y-3">
                            <div className="flex gap-3 items-center">
                                <div className="flex items-center border border-stone-300 rounded overflow-hidden h-11 bg-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 text-stone-500 hover:bg-stone-100 h-full flex items-center justify-center"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 text-stone-500 hover:bg-stone-100 h-full flex items-center justify-center"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                                    className="flex-1 bg-[#F4E8D1] hover:bg-[#ebd7b4] text-[#25221F] h-11 rounded font-bold text-xs transition-colors shadow-xs"
                                >
                                    أضف إلى السلة
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-[#25221F] hover:bg-[#6D1F32] text-white h-12 rounded font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center"
                            >
                                اشتري الآن عبر واتساب
                            </button>

                            <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="flex items-center gap-1.5 hover:text-[#9E2639] transition-colors"
                                >
                                    <Heart size={16} className={favorited ? 'fill-[#9E2639] text-[#9E2639]' : ''} />
                                    <span>{favorited ? 'في المفضلة' : 'أضف إلى المفضلة'}</span>
                                </button>
                                <div className="flex items-center gap-2 text-stone-600 bg-[#F8F4EC] px-3 py-1.5 rounded">
                                    <Truck size={15} className="text-[#6D1F32]" />
                                    <span>توصيل لكافة محافظات المملكة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};