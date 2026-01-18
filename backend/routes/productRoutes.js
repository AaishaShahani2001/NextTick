import express from "express";
import {
  getAllProducts,
  getProductById,
  getCollections
} from "../controllers/productController.js";

const router = express.Router();

/* ================= PUBLIC PRODUCT ROUTES ================= */

// Get watch collection
router.get("/collections", getCollections);

// List all watches
router.get("/", getAllProducts);

// Get single watch
router.get("/:id", getProductById);



export default router;
