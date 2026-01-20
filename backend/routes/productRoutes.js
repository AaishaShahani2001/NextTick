import express from "express";
import {
  getAllProducts,
  getFourProducts,
  getProductById,
  getCollections
} from "../controllers/productController.js";

const router = express.Router();

/* ================= PUBLIC PRODUCT ROUTES ================= */

// Get watch collection
router.get("/collections", getCollections);

// List all watches
router.get("/", getAllProducts);

// List 4 watches under new arrivals
router.get("/onlyfour", getFourProducts);

// Get single watch
router.get("/:id", getProductById);



export default router;
