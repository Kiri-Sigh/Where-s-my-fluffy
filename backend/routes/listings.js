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
  try {
    const listings = await prisma.listing.findMany({
      include: { images: true },
      orderBy: { id: "desc" },
    });
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});
router.post("/", authenticate, upload.array("images"), async (req, res) => {
  const uploadedImages = [];

  try {
    const {
      pet_name,
      description,
      expected_pet_location,
      bounty,
      user_id,
      location_latitude,
      location_longitude,
      location_name,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "listings" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const results = await Promise.all(
      req.files.map((file) => streamUpload(file.buffer))
    );

    results.forEach((result) => {
      uploadedImages.push({
        image_url: result.secure_url,
        image_name: result.public_id,
      });
    });

    const listing = await prisma.listing.create({
      data: {
        pet_name,
        description,
        expected_pet_location,
        bounty: parseFloat(bounty || 0),
        user_id,
        images: { create: uploadedImages },
      },
      include: { images: true },
    });

    let locationResponse = null;

    if (location_latitude && location_longitude) {
      const location = await prisma.location.create({
        data: {
          name: location_name || "Unknown location",
          latitude: parseFloat(location_latitude),
          longitude: parseFloat(location_longitude),
        },
      });

      await prisma.listingsLocation.create({
        data: {
          list_id: listing.id,
          location_id: location.id,
        },
      });

      locationResponse = location;
    }

    res.json({ listing, location: locationResponse });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    pet_name,
    description,
    bounty,
    expected_pet_location,
    user_id,
    status,
  } = req.body;

  try {
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      console.log("❌ Listing not found:", id);
      return res.status(404).json({ error: "Listing not found" });
    }

    if (existing.user_id !== user_id) {
      console.log("⚠️ Unauthorized update attempt:", user_id);
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        pet_name,
        description,
        bounty: bounty ? parseFloat(bounty) : 0,
        expected_pet_location,
        status,
      },
      include: {
        images: true,
        owner: true,
      },
    });

    console.log("✅ Updated listing:", updatedListing);
    res.json(updatedListing);
  } catch (error) {
    console.error("🔥 Error in PUT /listings/:id:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/by-location/:markerId", authenticate, async (req, res) => {
  const { markerId } = req.params;

  try {
    const listingLocation = await prisma.listingsLocation.findUnique({
      where: { location_id: markerId },
      include: { list: { include: { images: true, location_id: true } } },
    });

    if (!listingLocation)
      return res.status(404).json({ message: "Listing not found" });

    res.json(listingLocation.list); // send the Listing object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
