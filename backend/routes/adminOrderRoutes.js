import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

/* ================= ALL ORDERS ================= */
router.get("/", adminMiddleware, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/* ================= UPDATE STATUS ================= */
router.put("/:id/status", adminMiddleware, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  order.status = status;
  await order.save();

  res.json(order);
});

export default router;
