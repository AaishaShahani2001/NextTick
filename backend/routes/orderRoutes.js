import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

/* ================= CREATE ORDER ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

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

    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: "COD"
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
      .select("_id totalAmount status createdAt cancelledBy");

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


/* ================= GET A SINGLE ORDER  ================= */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
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

    order.status = "Cancelled";
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
