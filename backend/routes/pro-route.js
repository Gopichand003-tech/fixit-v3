import express from "express";
import multer from "multer";
import Provider from "../models/Provider.js";
import path from "path";

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Create uploads folder if not exists
import fs from "fs";
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Add new provider
router.post("/", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhaar", maxCount: 1 },
  { name: "pancard", maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, service, location, phone } = req.body;
    const documents = {
      photo: req.files.photo ? req.files.photo[0].path : "",
      aadhaar: req.files.aadhaar ? req.files.aadhaar[0].path : "",
      pancard: req.files.pancard ? req.files.pancard[0].path : "",
    };

    const newProvider = new Provider({ name, service, location, phone, documents });
    await newProvider.save();

    res.json({ message: "Provider saved successfully", provider: newProvider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
