import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    shortDescription: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "USD"
    },

    category: {
      type: String,
      required: true
      // Luxury | Classic | Sport
    },

    collection: {
      type: String,
      required: true
      // Classic Collection | Heritage Collection | Sport Collection
    },

    colors: {
      type: [String],
      required: true
    },

    images: {
      type: Map,
      of: String,
      required: true
      // { black: "url", silver: "url" }
    },

    stock: {
      type: Number,
      default: 0
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
