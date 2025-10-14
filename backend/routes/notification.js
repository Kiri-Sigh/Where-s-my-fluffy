import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { authenticate } from "./middleware/authenticate.js";

const prisma = new PrismaClient();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", authenticate, async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      include: { user: true, from: true, listing: true, image: true },
      orderBy: { created_at: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
      include: { user: true, from: true, listing: true, image: true },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
});

// POST /notifications/report-found
router.post(
  "/report-found",
  authenticate,
  upload.array("images"),
  async (req, res) => {
    const uploadedImages = [];

    try {
      const { user_id, from_id, listing_id, message } = req.body;

      if (!user_id || !from_id || !listing_id || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "notifications" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      if (req.files && req.files.length > 0) {
        const results = await Promise.all(
          req.files.map((file) => streamUpload(file.buffer))
        );

        results.forEach((result) => {
          uploadedImages.push({
            image_url: result.secure_url,
            image_name: result.public_id,
          });
        });
      }

      const notification = await prisma.notification.create({
        data: {
          user_id,
          from_id,
          listing_id,
          message,
          image:
            uploadedImages.length > 0 ? { create: uploadedImages } : undefined,
        },
        include: { image: true },
      });

      res.status(201).json(notification);
    } catch (err) {
      console.error("Error creating notification:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
router.get("/by-listing/:listingId", authenticate, async (req, res) => {
  const { listingId } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: { listing_id: listingId },
      orderBy: { created_at: "desc" },
      include: {
        image: true,
        from: { select: { id: true, name: true } },
      },
    });

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
