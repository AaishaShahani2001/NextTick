import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= ADMIN DASHBOARD STATS ================= */
router.get("/stats/overview", adminMiddleware, async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "Pending" });
  const processingOrders = await Order.countDocuments({ status: "Processing" });
  const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

  const revenueAgg = await Order.aggregate([
    { $match: { status: "Delivered" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments({ role: "user" });

  const recentOrders = await Order.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(3);

  res.json({
    totalOrders,
    pendingOrders,
    totalProducts,
    totalCustomers,
    processingOrders,
    deliveredOrders,
    totalRevenue,
    recentOrders
  });
});


/* ================= ALL ORDERS ================= */
router.get("/", adminMiddleware, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/* ================= UPDATE STATUS  ================= */
router.put("/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { status: newStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //  Cancelled orders are READ-ONLY
    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be modified"
      });
    }

    const statusFlow = ["Pending", "Processing", "Delivered"];

    // Allow cancel from ANY non-final state
    if (newStatus === "Cancelled") {
      if (order.status === "Delivered") {
        return res.status(400).json({
          message: "Delivered orders cannot be cancelled"
        });
      }

      order.status = "Cancelled";
      order.cancelledBy = "admin";
      
      await order.save();

      return res.json(order);
    }

    // From here onwards → normal forward-only logic
    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be modified"
      });
    }

    const currentIndex = statusFlow.indexOf(order.status);
    const nextIndex = statusFlow.indexOf(newStatus);

    // Invalid status
    if (nextIndex === -1) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //  Prevent backward changes
    if (nextIndex <= currentIndex) {
      return res.status(400).json({
        message: "Order status can only move forward"
      });
    }

    // STOCK DEDUCTION 
    if (newStatus === "Delivered") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        const variant = product.variants.find(
          (v) => v.sku === item.sku
        );

        if (!variant) {
          return res.status(400).json({
            message: `Variant not found for SKU ${item.sku}`
          });
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for SKU ${item.sku}`
          });
        }

        //  Reduce stock
        variant.stock -= item.quantity;

        // Auto-disable if out of stock
        if (variant.stock === 0) {
          variant.isAvailable = false;
        }

        await product.save();
      }
    }

    order.status = newStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});


/* ================= GET SINGLE ORDER (ADMIN) ================= */
router.get("/:id", adminMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});




export default router;
