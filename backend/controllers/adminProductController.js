import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import slugify from "slugify";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      basePrice,
      category,
      collection,
      variants,
      shortDescription,
      description,
      isFeatured
    } = req.body;

    /* ---------- BASIC VALIDATION ---------- */
    if (!name || !basePrice || !category || !variants) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const parsedVariants = JSON.parse(variants);

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one variant is required" });
    }

    /* ---------- VARIANT VALIDATION ---------- */
    for (const v of parsedVariants) {
      if (
        !v.sku ||
        !v.strapType ||
        !v.color ||
        !v.sizeMM ||
        v.stock == null
      ) {
        return res.status(400).json({
          message:
            "Each variant must include sku, strapType, color, sizeMM and stock"
        });
      }
    }

    /* ---------- IMAGE VALIDATION ---------- */
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    /* ---------- CLOUDINARY UPLOAD ---------- */
    const imageUrls = [];

    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "chronolux/products" }
      );
      imageUrls.push(uploadResult.secure_url);
    }

    /* ---------- CREATE PRODUCT ---------- */
    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true }),
      shortDescription,
      description,
      basePrice,
      category,
      collection,
      variants: parsedVariants,
      images: imageUrls,
      isFeatured: isFeatured ?? false,
      status: "active"
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const {
      name,
      basePrice,
      category,
      collection,
      variants,
      shortDescription,
      description,
      isFeatured,
      status
    } = req.body;

    /* ---------- UPDATE VARIANTS ---------- */
    if (variants) {
      const parsedVariants = JSON.parse(variants);

      for (const v of parsedVariants) {
        if (
          !v.sku ||
          !v.strapType ||
          !v.color ||
          !v.sizeMM ||
          v.stock == null
        ) {
          return res.status(400).json({
            message:
              "Each variant must include sku, strapType, color, sizeMM and stock"
          });
        }
      }

      product.variants = parsedVariants;
    }

    /* ---------- IMAGE UPDATE (OPTIONAL) ---------- */
    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "chronolux/products" }
        );
        imageUrls.push(uploadResult.secure_url);
      }

      product.images = imageUrls;
    }

    /* ---------- UPDATE FIELDS ---------- */
    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true });
    }

    product.basePrice = basePrice ?? product.basePrice;
    product.category = category ?? product.category;
    product.collection = collection ?? product.collection;
    product.shortDescription =
      shortDescription ?? product.shortDescription;
    product.description = description ?? product.description;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.status = status ?? product.status;

    await product.save();

    res.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
