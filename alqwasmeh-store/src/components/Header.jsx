import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, User } from 'lucide-react';
import { AlQwasmehLogo } from './AlQwasmehLogo';
import { useShop } from '../context/ShopContext';

export const Header = () => {
    const { cart, wishlist, user, setIsCartOpen, setIsWishlistOpen, setIsAuthOpen } = useShop();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const navItems = [
        {
            title: "الرئيسية",
            path: "/",
            dropdown: [
                { label: "أحدث التشكيلات", path: "/products" },
                { label: "الأكثر طلباً", path: "/products?category=occasions" }
            ]
        },
        {
            title: "جميع الأثواب",
            path: "/products",
            dropdown: [
                { label: "أثواب تراثية فلسطينية", path: "/products?category=traditional" },
                { label: "أثواب المناسبات والأعراس", path: "/products?category=occasions" },
                { label: "بشوت وقفاطين عصرية", path: "/products?category=abayas" }
            ]
        },
        {
            title: "قصتنا",
            path: "/about",
            dropdown: [
                { label: "عن دار القواسمة", path: "/about" }
            ]
        },
        {
            title: "تواصل معنا",
            path: "/contact",
            dropdown: [
                { label: "خدمة العملاء وموقعنا", path: "/contact" }
            ]
        }
    ];

    const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // دالة تنفيذ البحث وتوجيه المستخدم لصفحة المنتجات
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-[#F8F4EC]/95 backdrop-blur-md border-b border-[#EEE5D8]">
            {/* شريط الإعلان العلوي */}
            <div className="bg-[#6D1F32] text-white text-[10px] sm:text-xs py-1.5 px-3 text-center font-light leading-tight">
                أصالة التراث، وأناقة التفاصيل — تفصيل يدوي وشحن لجميع المحافظات
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between min-h-[72px] sm:min-h-[88px] py-1">
                    
                    {/* زر القائمة للموبايل */}
                    <div className="flex items-center lg:hidden">
                        <button 
                            onClick={() => setMobileMenuOpen(true)} 
                            className="p-1.5 text-[#25221F] hover:text-[#9E2639] transition-colors"
                            aria-label="فتح القائمة"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* الروابط لسطح المكتب */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navItems.map((item, idx) => (
                            <div key={idx} className="relative group py-5">
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-1 text-xs xl:text-sm font-medium text-[#25221F] hover:text-[#9E2639] transition-colors"
                                >
                                    {item.title}
                                    <ChevronDown size={13} className="text-[#B59A67] transition-transform duration-200 group-hover:rotate-180" />
                                </Link>

                                <div className="absolute top-full right-0 w-52 bg-white shadow-xl rounded-b-lg border border-[#EEE5D8] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    {item.dropdown.map((sub, sIdx) => (
                                        <Link
                                            key={sIdx}
                                            to={sub.path}
                                            className="w-full text-right px-4 py-2 text-xs font-medium text-[#25221F] hover:bg-[#F8F4EC] hover:text-[#9E2639] transition-colors block"
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* شعار الموقع */}
                    <Link to="/" className="cursor-pointer px-1 sm:px-4 scale-90 sm:scale-100 transition-transform">
                        <AlQwasmehLogo />
                    </Link>

                    {/* أزرار الإجراءات */}
                    <div className="flex items-center gap-1 sm:gap-3">
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="p-1.5 sm:p-2 text-[#25221F] hover:text-[#9E2639] transition-colors flex items-center gap-1"
                            title={user ? user.name : "تسجيل الدخول"}
                        >
                            <User size={19} className="sm:w-[21px] sm:h-[21px]" />
                            {user && <span className="hidden md:inline text-xs font-semibold text-[#6D1F32] max-w-[90px] truncate">{user.name}</span>}
                        </button>

                        {/* زر فتح/إغلاق شريط البحث */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-1.5 sm:p-2 transition-colors ${isSearchOpen ? 'text-[#6D1F32]' : 'text-[#25221F] hover:text-[#9E2639]'}`}
                            title="بحث في الأثواب"
                        >
                            <Search size={19} className="sm:w-[21px] sm:h-[21px]" />
                        </button>

                        <button
                            onClick={() => setIsWishlistOpen(true)}
                            className="p-1.5 sm:p-2 text-[#25221F] hover:text-[#9E2639] relative transition-colors"
                            title="المفضلة"
                        >
                            <Heart size={19} className="sm:w-[21px] sm:h-[21px]" />
                            {wishlist.length > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[#9E2639] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                                    {wishlist.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-1.5 sm:p-2 text-[#25221F] hover:text-[#9E2639] relative transition-colors"
                            title="حقيبة الشراء"
                        >
                            <ShoppingBag size={19} className="sm:w-[21px] sm:h-[21px]" />
                            {totalCartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[#6D1F32] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                                    {totalCartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* شريط البحث المنسدل تحت الهيدر */}
                {isSearchOpen && (
                    <div className="pb-4 pt-1 transition-all duration-300">
                        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
                            <input
                                type="text"
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث باسم الثوب، المدينة (القدس، رام الله)، أو نوع القماش..."
                                className="w-full bg-white border border-[#EEE5D8] focus:border-[#6D1F32] rounded-full py-2.5 pr-11 pl-20 text-xs sm:text-sm text-right text-stone-800 shadow-sm outline-none transition-all placeholder:text-stone-400"
                            />
                            <Search size={18} className="absolute right-4 text-stone-400 pointer-events-none" />
                            
                            <div className="absolute left-2 flex items-center gap-1">
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-[#6D1F32] hover:bg-[#521726] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors"
                                >
                                    بحث
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* درج القائمة للموبايل */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex justify-end">
                    <div className="w-[82%] max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 text-right">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                                <span className="font-bold text-sm text-[#25221F]">القائمة الرئيسية</span>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="divide-y divide-stone-100 py-2">
                                {navItems.map((item, idx) => (
                                    <div key={idx} className="py-2.5">
                                        <Link
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="font-bold text-sm text-[#25221F] block hover:text-[#6D1F32]"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="pr-3 mt-1.5 space-y-1">
                                            {item.dropdown.map((sub, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    to={sub.path}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="text-xs text-stone-500 py-1 hover:text-[#9E2639] block"
                                                >
                                                    • {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-100 text-center">
                            <span className="text-[11px] text-stone-400 block mb-2">دار القواسمة للتطريز التراثي</span>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setIsAuthOpen(true);
                                }}
                                className="w-full py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs font-bold text-[#6D1F32]"
                            >
                                {user ? `تسجيل الدخول باسم: ${user.name}` : 'تسجيل الدخول / حساب جديد'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};