import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= GET LOGGED-IN USER ================= */
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
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
