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

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone_no: true,
        line_id: true,
        insta: true,
        facebook: true,
        balance: true,
        created_at: true,
        updated_at: true,
        image: {
          select: {
            image_url: true,
            image_name: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// PUT /users/:id - edit user
router.put("/:id", authenticate, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { username, name, email, phone_no, line_id, insta, facebook } =
    req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { image: true },
    });

    if (!existingUser) return res.status(404).json({ error: "User not found" });

    let imageData = undefined;

    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);

      if (existingUser.image) {
        await prisma.image.delete({ where: { id: existingUser.image.id } });
      }

      imageData = {
        connect: {
          id: (
            await prisma.image.create({
              data: {
                image_url: result.secure_url,
                image_name: result.public_id,
                user_id: id,
              },
            })
          ).id,
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        name,
        email,
        phone_no,
        line_id,
        insta,
        facebook,
        image: imageData,
      },
      include: { image: true },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
