import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/products';
import { useNavigate } from 'react-router-dom';

export const WishlistDrawer = () => {
    const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart, setSelectedProduct } = useShop();
    const navigate = useNavigate();
    if (!isWishlistOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
                <div>
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                            <Heart size={20} className="fill-[#9E2639] text-[#9E2639]" />
                            <h3 className="font-bold text-base text-[#25221F]">الأثواب المفضلة ({wishlist.length})</h3>
                        </div>
                        <button
                            onClick={() => setIsWishlistOpen(false)}
                            className="p-1 hover:bg-stone-100 rounded-full text-stone-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {wishlist.length === 0 ? (
                        <div className="py-24 text-center">
                            <Heart size={44} className="mx-auto text-stone-300 stroke-1 mb-3" />
                            <p className="text-stone-500 text-sm font-medium">لم تقم بإضافة أي أثواب إلى المفضلة بعد.</p>
                            <span className="text-xs text-stone-400 block mt-1">اضغط على رمز القلب فوق أي ثوب لحفظه هنا.</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100 max-h-[70vh] overflow-y-auto mt-4 pr-1">
                            {wishlist.map((item) => (
                                <div key={item.id} className="py-4 flex gap-3 items-center justify-between">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => {
                                            navigate(`/product/${item._id || item.id}`);
                                            setIsWishlistOpen(false);
                                        }}
                                    >
                                        <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-md border border-stone-200" />
                                        <div>
                                            <h4 className="text-xs font-bold text-[#25221F] hover:text-[#9E2639] transition-colors">{item.name}</h4>
                                            <span className="text-[11px] text-[#596247] block mt-0.5">{item.region}</span>
                                            <span className="text-xs font-bold text-[#6D1F32] mt-1 block">{item.price} {BRAND_CONFIG.currency}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                addToCart(item, item.sizes?.[0] || 'M', item.colors?.[0] || 'افتراضي');
                                                toggleWishlist(item);
                                            }}
                                            className="bg-[#6D1F32] hover:bg-[#521726] text-white p-2 rounded-full text-xs transition-colors"
                                            title="إضافة للحقيبة"
                                        >
                                            <ShoppingBag size={15} />
                                        </button>
                                        <button
                                            onClick={() => toggleWishlist(item)}
                                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                                            title="حذف من المفضلة"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {wishlist.length > 0 && (
                    <div className="pt-4 border-t border-stone-200">
                        <button
                            onClick={() => setIsWishlistOpen(false)}
                            className="w-full bg-[#EEE5D8] hover:bg-[#e4d8c7] text-[#25221F] py-3 rounded-lg text-xs font-bold"
                        >
                            متابعة التصفح
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};