import Product from "../models/Product.js";

/* ================= GET ALL PRODUCTS (USER) ================= */
// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select(
        "name basePrice category collection shortDescription images variants"
      )
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ================= GET SINGLE PRODUCT (USER) ================= */
// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(400).json({ message: "Invalid product ID" });
  }
};


/* ================= GET WATCH COLLECTION (USER) ================= */
// GET /api/products/collections

export const getCollections = async (req, res) => {
  try {
    const collections = await Product.aggregate([
      {
        $group: {
          _id: "$collection",
          count: { $sum: 1 },
          image: { $first: "$images" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: "Failed to load collections" });
  }
};
