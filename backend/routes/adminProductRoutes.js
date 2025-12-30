import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/adminProductController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* Protect all admin routes */
router.use(authMiddleware, adminMiddleware);

/* ================= PRODUCTS ================= */

// CREATE product (WITH IMAGE)
router.post(
  "/",
  upload.single("image"), 
  createProduct
);

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// UPDATE product (image optional)
router.put(
  "/:id",
  upload.single("image"), // REQUIRED
  updateProduct
);

// DELETE product
router.delete("/:id", deleteProduct);

export default router;
