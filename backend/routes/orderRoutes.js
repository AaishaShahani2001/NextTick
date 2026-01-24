import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

const DISCOUNT_THRESHOLD = 300000;
const DISCOUNT_PERCENT = 5;

/* ================= CREATE ORDER ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    const { name, email, phone, address, city, province, country, postalCode } = shippingAddress || {};

    if (!name || !email || !phone || !address || !city || !postalCode || !province || !country) {
      return res.status(400).json({
        message: "Incomplete shipping address"
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`
        });
      }

      const variant = product.variants.find(
        (v) => v.sku === item.sku
      );

      if (!variant) {
        return res.status(400).json({
          message: `Variant not found: ${item.sku}`
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}`
        });
      }
    }

    // Deduct stock
    for (const item of items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.sku": item.sku
        },
        {
          $inc: { "variants.$.stock": -item.quantity }
        }
      );
    }

    // Calculate subtotal from items
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    if (subtotal >= DISCOUNT_THRESHOLD) {
      discount = (subtotal * DISCOUNT_PERCENT) / 100;
    }

    const finalTotal = subtotal - discount;


    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      subtotal,
      discount,
      totalAmount: finalTotal,
      paymentMethod: "COD",
      status: "Pending",
      statusHistory: [
        {
          status: "Pending",
          at: new Date()
        }
      ]
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});



/* ================= GET ALL ORDERS  ================= */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    //.select("_id totalAmount status createdAt cancelledBy discount");

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


/* ================= GET A SINGLE ORDER (CUSTOMER) ================= */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      _id: order._id,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,

      // courier info
      courier: order.courier?.name || null,
      trackingId: order.courier?.trackingId || null,

      // status history with admin note
      statusHistory: order.statusHistory?.map(h => ({
        status: h.status,
        at: h.at,
        comment: h.comment || null
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});



/* ================= EDIT ORDER  ================= */
// router.get("/:id", authMiddleware, async (req, res) => {

//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       user: req.user._id
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch order" });
//   }
// });


/* ================= CANCEL ORDER (PENDING ONLY) ================= */
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled"
      });
    }

    order.status = "Cancelled";
    order.cancelledBy = "customer";

    order.statusHistory.push({
      status: "Cancelled",
      at: new Date()
    });

    // Restore stock
    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.sku": item.sku
        },
        {
          $inc: { "variants.$.stock": item.quantity }
        }
      );
    }


    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
});




router.put("/:id/edit-request", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Processing") {
      return res.status(400).json({
        message: "Order cannot be edited. Please contact support."
      });
    }

    // optional flag for admin
    order.editRequested = true;
    await order.save();

    res.json({ message: "Edit request sent to store" });
  } catch (err) {
    res.status(500).json({ message: "Edit request failed" });
  }
});


export default router;
