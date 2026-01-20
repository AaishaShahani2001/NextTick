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
        sku: {
          type: String,
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
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true }

    },

    courier: {
      type: String,
      default: null
    },
    trackingId: {
      type: String,
      default: null
    },


    subtotal: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending"
    },

    paymentMethod: {
      type: String,
      default: "COD"
    },

    cancelledBy: {
      type: String,
      enum: ["customer", "admin"],
      default: null
    }

  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
