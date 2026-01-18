import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ================= DASHBOARD OVERVIEW ================= */
router.get("/stats/overview", adminMiddleware, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const processingOrders = await Order.countDocuments({ status: "Processing" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

    //  Revenue (only delivered)
    const revenueAgg = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Products count
    const totalProducts = await Product.countDocuments();

    // Customers count (exclude admins)
    const totalCustomers = await User.countDocuments({ role: "user" });

    //  Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

export default router;
