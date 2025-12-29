import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= GET LOGGED-IN USER ================= */
router.get("/me", authMiddleware, async (req, res) => {
  //console.log("AUTH USER:", req.user);
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role 
  });
});

/* ================= UPDATE PROFILE ================= */

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});


export default router;
