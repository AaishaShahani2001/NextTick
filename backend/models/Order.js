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
      name: { type: String },
      trackingId: { type: String },
      shippedAt: { type: Date }
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
      enum: ["Awaiting Payment", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true
    },

    cancelledBy: {
      type: String,
      enum: ["customer", "admin"],
      default: null
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Awaiting Payment", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
          required: true
        },
        at: {
          type: Date,
          default: Date.now
        },
        comment: {
          type: String, // ← ADMIN NOTE
          trim: true,
          default: "admin"
        }
      }
    ],

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },

    paymentIntentId: String, // Stripe / PayHere
    paidAt: Date




  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
