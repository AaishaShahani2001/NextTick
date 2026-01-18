import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

/* ================= CREATE ORDER ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id
    });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
});


/* ================= GET ALL ORDERS  ================= */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("_id totalAmount status createdAt");

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

    // ONLY Pending orders can be cancelled
    if (order.status !== "Pending") {
      return res.status(400).json({
        message:
          "Only pending orders can be cancelled. Please contact the store or support team."
      });
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
