import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "./middleware/authenticate.js";

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/my-lists/:userId
router.get("/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    const listings = await prisma.listing.findMany({
      where: { user_id: userId },
      include: {
        location_id: {
          include: {
            location: true,
          },
        },
      },
    });

    const result = listings.map((l) => {
      const locRelation = l.location_id;
      const location = locRelation?.location;

      return {
        id: l.id,
        pet_name: l.pet_name,
        status: l.status,
        bounty: l.bounty,
        description: l.description,
        created_at: l.created_at,
        location_id: locRelation?.id || null,
        location: location
          ? {
              id: location.id,
              name: location.name,
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.location_address,
            }
          : null,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching user lists:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
