import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    category: String,
    collection: String,
    colors: [String],
    image: {
      type: String,
      required: true
    },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
