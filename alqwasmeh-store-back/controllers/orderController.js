import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

const MAX_ITEMS = 50;
const MAX_QUANTITY = 20;

const badRequest = (res, message) => res.status(400).json({ success: false, message });

// @desc    إنشاء طلب جديد — الأسعار والأسماء تُقرأ من قاعدة البيانات وليس من العميل
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return badRequest(res, 'حقيبة الشراء فارغة');
    }
    if (orderItems.length > MAX_ITEMS) {
      return badRequest(res, 'عدد القطع في الطلب أكبر من المسموح');
    }

    const ids = orderItems.map((item) => String(item?.product));
    if (!ids.every((id) => mongoose.isValidObjectId(id))) {
      return badRequest(res, 'معرف ثوب غير صالح في الطلب');
    }

    const products = await Product.find({ _id: { $in: ids } }).lean();
    const productsById = new Map(products.map((p) => [String(p._id), p]));

    const items = [];
    let totalPrice = 0;

    for (const item of orderItems) {
      const product = productsById.get(String(item.product));
      if (!product || product.available === false) {
        return badRequest(res, 'أحد الأثواب المطلوبة غير متوفر');
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return badRequest(res, 'كمية غير صالحة في الطلب');
      }

      const selectedSize = String(item.selectedSize || '');
      const selectedColor = String(item.selectedColor || '');
      if (!selectedSize || (product.sizes?.length && !product.sizes.includes(selectedSize))) {
        return badRequest(res, `المقاس المختار غير متوفر للثوب (${product.name})`);
      }
      if (!selectedColor || (product.colors?.length && !product.colors.includes(selectedColor))) {
        return badRequest(res, `اللون المختار غير متوفر للثوب (${product.name})`);
      }

      items.push({
        product: product._id,
        name: product.name,
        selectedSize,
        selectedColor,
        quantity,
        price: product.price,
        image: product.image,
      });
      totalPrice += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      totalPrice,
      shippingAddress: {
        city: String(shippingAddress?.city || '').trim().slice(0, 60) || undefined,
        addressDetails: String(shippingAddress?.addressDetails || '').trim().slice(0, 300) || undefined,
      },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب طلبات المستخدم الحالي
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
