import mongoose from "mongoose";

/* ================================
   Variant Schema (Sellable Unit)
================================ */
const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true, 
    },

    strapType: {
      type: String,
      enum: ["Leather", "Metal", "Silicone"],
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    sizeMM: {
      type: Number, // 40, 42, 44
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    priceAdjustment: {
      type: Number,
      default: 0, // added to basePrice
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/* ================================
   Product Schema
================================ */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
    },

    description: {
      type: String,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },

    collection: {
      type: String,
      enum: ["Classic", "Sport", "Luxury", "Limited", "SmartWatch"],
    },

    variants: {
      type: [variantSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one variant is required",
      },
    },

    images: {
      type: [String], // multiple images
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);


export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
