import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'يرجى إدخال اسم الثوب أو القطعة'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'يرجى إدخال السعر'],
      min: [0, 'لا يمكن أن يكون السعر أقل من صفر']
    },
    category: {
      type: String,
      required: [true, 'يرجى تحديد الفئة'],
      enum: ['traditional', 'occasions', 'modern', 'abayas']
    },
    fabric: {
      type: String,
      required: [true, 'يرجى تحديد نوع القماش']
    },
    embroideryType: {
      type: String,
      required: [true, 'يرجى تحديد نوع التطريز']
    },
    embroideryColor: {
      type: String,
      required: [true, 'يرجى تحديد لون أو أسلوب التطريز']
    },
    description: {
      type: String,
      required: [true, 'يرجى إدخال وصف الثوب']
    },
    image: {
      type: String,
      required: [true, 'يرجى وضع مسار الصورة الرئيسية']
    },
    images: {
      type: [String],
      default: []
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    colors: {
      type: [String],
      default: ['افتراضي']
    },
    region: {
      type: String,
      default: 'تراث فلسطيني / أردني'
    },
    isNewProduct: {
      type: Boolean,
      default: false
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);