import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  lowStockAlert
} from "../controllers/adminProductController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* Protect all admin routes */
router.use(authMiddleware, adminMiddleware);

/* ================= PRODUCTS ================= */

// CREATE product (MULTIPLE IMAGES)
router.post(
  "/",
  upload.array("images", 5), // max 5 images
  createProduct
);

// GET all products
router.get("/", getProducts);

//LOW STOCK PRODUCTS 
router.get("/low-stock", lowStockAlert);

// GET single product
router.get("/:id", getProductById);

// UPDATE product (images optional)
router.put(
  "/:id",
  upload.array("images", 5),
  updateProduct
);

// DELETE product
router.delete("/:id", deleteProduct);



export default router;
