import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

/* ================= ADD PRODUCT ================= */
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Product creation failed" });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch {
    res.status(500).json({ message: "Product update failed" });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ message: "Product deletion failed" });
  }
});

export default router;
