import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "./middleware/authenticate.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/add", authenticate, async (req, res) => {
  try {
    const { user_id, list_id } = req.body;

    if (!user_id || !list_id)
      return res.status(400).json({ error: "Missing user_id or list_id" });

    const existing = await prisma.userPinnedListings.findUnique({
      where: { list_id_user_id: { list_id, user_id } },
    });

    if (existing)
      return res.status(400).json({ error: "Already pinned by this user" });

    const newPin = await prisma.userPinnedListings.create({
      data: {
        user_id,
        list_id,
      },
    });

    res.json({ message: "Pinned successfully", data: newPin });
  } catch (error) {
    console.error("Error creating pin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET /api/pinned/:userId
router.get("/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    const pinnedListings = await prisma.userPinnedListings.findMany({
      where: { user_id: userId },
      include: {
        user: {
          include: {
            location_id: {
              include: {
                location: true, 
              },
            },
          },
        },
      },
    });

    const result = pinnedListings.map((p) => {
      const listing = p.user;
      const locationRelation = listing?.location_id;
      const location = locationRelation?.location;

      return {
        id: listing.id,
        pet_name: listing.pet_name,
        status: listing.status,
        bounty: listing.bounty,
        description: listing.description,
        created_at: listing.created_at,
        location_id: locationRelation?.id || null, 
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
    console.error("Error fetching pinned listings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
