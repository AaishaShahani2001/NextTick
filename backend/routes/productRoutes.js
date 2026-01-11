import express from "express";
import {
  getAllProducts,
  getProductById
} from "../controllers/productController.js";

const router = express.Router();

/* ================= PUBLIC PRODUCT ROUTES ================= */

// List all watches
router.get("/", getAllProducts);

// Get single watch
router.get("/:id", getProductById);

export default router;
