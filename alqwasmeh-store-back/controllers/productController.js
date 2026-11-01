import { Product } from '../models/Product.js';

// الحقول المسموح بتعديلها فقط (يمنع تمرير _id أو createdAt أو أي حقل غير معروف)
const PRODUCT_FIELDS = [
  'name', 'price', 'category', 'fabric', 'embroideryType', 'embroideryColor',
  'description', 'image', 'images', 'sizes', 'colors', 'region', 'isNewProduct', 'available',
];

const pickProductFields = (body = {}) =>
  Object.fromEntries(PRODUCT_FIELDS.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    جلب جميع الأثواب مع دعم الفلترة بالتصنيف
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (typeof category === 'string' && category && category !== 'all') {
      query.category = category;
    }

    if (typeof search === 'string' && search.trim()) {
      query.name = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب تفاصيل ثوب واحد بواسطة المعرف ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'الثوب المطلوب غير متوفر' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    إضافة ثوب جديد (للمسؤول فقط)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(pickProductFields(req.body));
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    تعديل ثوب (للمسؤول فقط) — يُحدَّث فقط ما أُرسل من حقول
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const updates = pickProductFields(req.body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'لم يتم إرسال أي بيانات للتعديل' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'الثوب غير موجود' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    حذف ثوب (للمسؤول فقط)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'الثوب غير موجود' });
    }
    res.status(200).json({ success: true, message: 'تم حذف الثوب بنجاح' });
  } catch (error) {
    next(error);
  }
};
