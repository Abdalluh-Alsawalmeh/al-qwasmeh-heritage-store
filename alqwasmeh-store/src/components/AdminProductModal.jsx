import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AdminProductModal = ({ isOpen, onClose, productToEdit }) => {
    const { addProduct, updateProduct } = useShop();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'traditional',
        fabric: '',
        embroideryType: '',
        embroideryColor: '',
        description: '',
        image: '',
        images: [],
        sizesText: 'S, M, L, XL',
        colorsText: '',
        region: 'القدس ورام الله',
        isNewProduct: false,
        available: true
    });

    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                price: productToEdit.price || '',
                category: productToEdit.category || 'traditional',
                fabric: productToEdit.fabric || '',
                embroideryType: productToEdit.embroideryType || '',
                embroideryColor: productToEdit.embroideryColor || '',
                description: productToEdit.description || '',
                image: productToEdit.image || '',
                images: Array.isArray(productToEdit.images) ? productToEdit.images : [],
                sizesText: Array.isArray(productToEdit.sizes) ? productToEdit.sizes.join(', ') : 'S, M, L, XL',
                colorsText: Array.isArray(productToEdit.colors) ? productToEdit.colors.join(', ') : '',
                region: productToEdit.region || 'القدس ورام الله',
                isNewProduct: !!productToEdit.isNewProduct,
                available: productToEdit.available !== undefined ? productToEdit.available : true
            });
        } else {
            setFormData({
                name: '',
                price: '',
                category: 'traditional',
                fabric: 'كتان فاخر',
                embroideryType: 'تطريز يدوي متقن',
                embroideryColor: 'ألوان متعددة',
                description: '',
                image: '',
                images: [],
                sizesText: 'S, M, L, XL',
                colorsText: 'أسود ملكي, بيج',
                region: 'تراث فلسطيني',
                isNewProduct: true,
                available: true
            });
        }
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    // دالة رفع الصورة الأساسية من الجهاز
    const handleMainImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploadingMain(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({
                    ...prev,
                    image: data.imageUrl,
                    // إذا كانت مصفوفة الصور فارغة نضيفها كصورة أولى
                    images: prev.images.length === 0 ? [data.imageUrl] : prev.images
                }));
            } else {
                setError(data.message || 'فشل رفع الصورة');
            }
        } catch (err) {
            setError('تعذر الاتصال بخادم رفع الصور');
        } finally {
            setUploadingMain(false);
        }
    };

    // دالة رفع صور المعرض الإضافية
    const handleGalleryImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingGallery(true);
        setError('');

        try {
            const uploadedUrls = [];
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('image', file);

                const res = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: uploadData
                });
                const data = await res.json();
                if (data.success) {
                    uploadedUrls.push(data.imageUrl);
                }
            }

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
        } catch (err) {
            setError('حدث خطأ أثناء رفع بعض الصور الإضافية');
        } finally {
            setUploadingGallery(false);
        }
    };

    // حذف صورة من المعرض الإضافي
    const handleRemoveGalleryImage = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            setError('يرجى اختيار صورة أساسية للثوب أولاً');
            return;
        }

        setLoading(true);
        setError('');

        const sizes = formData.sizesText.split(',').map((s) => s.trim()).filter(Boolean);
        const colors = formData.colorsText.split(',').map((s) => s.trim()).filter(Boolean);

        const payload = {
            ...formData,
            price: Number(formData.price),
            sizes,
            colors,
            images: formData.images.length > 0 ? formData.images : [formData.image]
        };
        delete payload.sizesText;
        delete payload.colorsText;

        let res;
        if (productToEdit) {
            const id = productToEdit._id || productToEdit.id;
            res = await updateProduct(id, payload);
        } else {
            res = await addProduct(payload);
        }

        setLoading(false);
        if (res.success) {
            onClose();
        } else {
            setError(res.message || 'حدث خطأ أثناء حفظ الثوب');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col text-right">
                {/* الترويسة */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF8F5]">
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1">
                        <X size={20} />
                    </button>
                    <h3 className="font-bold text-base text-[#25221F]">
                        {productToEdit ? 'تعديل بيانات الثوب' : 'إضافة ثوب جديد للمتجر'}
                    </h3>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-semibold">
                        {error}
                    </div>
                )}

                {/* النموذج */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">اسم الثوب / القطعة *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:border-[#6D1F32] outline-none"
                                placeholder="مثال: ثوب فرح التراثي"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">السعر (د.أ) *</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:border-[#6D1F32] outline-none"
                                placeholder="مثال: 120"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">الفئة *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:border-[#6D1F32] outline-none bg-white"
                            >
                                <option value="traditional">أثواب تراثية</option>
                                <option value="occasions">أثواب المناسبات</option>
                                <option value="modern">تصاميم عصرية</option>
                                <option value="abayas">بشوت وقفاطين</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">المنطقة / الطراز</label>
                            <input
                                type="text"
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:border-[#6D1F32] outline-none"
                                placeholder="مثال: رام الله والقدس"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">نوع القماش</label>
                            <input
                                type="text"
                                value={formData.fabric}
                                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                placeholder="مثال: كتان فاخر"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">نوع التطريز</label>
                            <input
                                type="text"
                                value={formData.embroideryType}
                                onChange={(e) => setFormData({ ...formData, embroideryType: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                placeholder="مثال: تطريز يدوي متقن"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">لون التطريز</label>
                            <input
                                type="text"
                                value={formData.embroideryColor}
                                onChange={(e) => setFormData({ ...formData, embroideryColor: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                placeholder="مثال: رماني وذهبي"
                            />
                        </div>
                    </div>

                    {/* قسم اختيار الصورة الأساسية من الجهاز */}
                    <div className="p-4 border rounded-xl bg-stone-50/70 border-stone-200">
                        <label className="block font-bold text-stone-800 mb-2">الصورة الأساسية للثوب *</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center justify-center gap-2 bg-white border border-dashed border-[#6D1F32] text-[#6D1F32] hover:bg-[#6D1F32]/5 px-4 py-2.5 rounded-lg cursor-pointer transition-colors shadow-xs font-semibold">
                                {uploadingMain ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Upload size={16} />
                                )}
                                <span>{uploadingMain ? 'جارٍ رفع الصورة...' : 'اختر صورة من جهازك'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleMainImageUpload}
                                    disabled={uploadingMain}
                                />
                            </label>

                            {formData.image && (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={formData.image}
                                        alt="معاينة الأساسية"
                                        className="w-12 h-16 object-cover rounded-md border border-stone-300 shadow-xs"
                                    />
                                    <span className="text-xs text-green-700 font-semibold">تم اختيار الصورة بنجاح ✓</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* قسم صور المعرض الإضافية */}
                    <div className="p-4 border rounded-xl bg-stone-50/70 border-stone-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block font-bold text-stone-800">صور إضافية لمعرض الثوب</label>
                            <label className="flex items-center gap-1.5 text-xs text-[#6D1F32] hover:underline cursor-pointer font-bold">
                                {uploadingGallery ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Upload size={14} />
                                )}
                                <span>+ إضافة صور أخرى من الجهاز</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleGalleryImageUpload}
                                    disabled={uploadingGallery}
                                />
                            </label>
                        </div>

                        {formData.images.length > 0 ? (
                            <div className="flex gap-2.5 flex-wrap pt-2">
                                {formData.images.map((imgUrl, idx) => (
                                    <div key={idx} className="relative group w-14 h-16 rounded-md overflow-hidden border border-stone-300 shadow-xs">
                                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryImage(idx)}
                                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="حذف الصورة"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-stone-400">لم تقم بإضافة صور إضافية بعد.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">المقاسات (مفصولة بفاصلة)</label>
                            <input
                                type="text"
                                value={formData.sizesText}
                                onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                placeholder="S, M, L, XL"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-stone-700 mb-1">الألوان (مفصولة بفاصلة)</label>
                            <input
                                type="text"
                                value={formData.colorsText}
                                onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                placeholder="أسود ملكي, كحلي, بيج"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-stone-700 mb-1">وصف الثوب *</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg outline-none"
                            placeholder="اكتب وصفاً تراثياً أنيقاً للقطعة..."
                        />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                            <input
                                type="checkbox"
                                checked={formData.isNewProduct}
                                onChange={(e) => setFormData({ ...formData, isNewProduct: e.target.checked })}
                                className="rounded text-[#6D1F32] w-4 h-4"
                            />
                            <span>تمييز كـ (جديد)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                            <input
                                type="checkbox"
                                checked={formData.available}
                                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                className="rounded text-[#6D1F32] w-4 h-4"
                            />
                            <span>متوفر للطلب</span>
                        </label>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-stone-300 font-semibold hover:bg-stone-50"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploadingMain || uploadingGallery}
                            className="px-6 py-2.5 rounded-lg bg-[#6D1F32] text-white font-bold hover:bg-[#521726] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'جارٍ الحفظ...' : productToEdit ? 'حفظ التعديلات' : 'إضافة الثوب'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};