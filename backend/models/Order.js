import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        color: String,
        image: String
      }
    ],

    shippingAddress: {
      name: String,
      email: String,
      phone: String,
      address: String
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending"
    },

    paymentMethod: {
      type: String,
      default: "COD"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
