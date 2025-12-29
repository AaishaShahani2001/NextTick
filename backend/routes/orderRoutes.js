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

export default router;
