import multer from "multer";

/* ================= MULTER CONFIG ================= */
// Memory storage → required for Cloudinary base64 upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP images are allowed"));
    } else {
      cb(null, true);
    }
  }
});

export default upload;
