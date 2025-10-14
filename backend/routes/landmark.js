import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "./middleware/authenticate.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const landmarks = await prisma.location.findMany();
  res.json(landmarks);
});

router.get("/:id/listing", authenticate, async (req, res) => {
  const landmarkId = parseInt(req.params.id, 10);

  try {
    const landmark = await prisma.landmark.findUnique({
      where: { id: landmarkId },
      include: { listings: true },
    });

    if (!landmark) {
      return res.status(404).json({ error: "Landmark not found" });
    }

    res.json({
      landmark: {
        id: landmark.id,
        name: landmark.name,
        latitude: landmark.latitude,
        longitude: landmark.longitude,
      },
      listings: landmark.listings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const landmark = await prisma.location.create({
      data: { name, latitude: Number(latitude), longitude: Number(longitude) },
    });
    res.json(landmark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create landmark" });
  }
});

// GET /api/nearby?lat=...&lon=...&radius=...
router.get("/nearby", authenticate, async (req, res) => {
  try {
    const { lat, lon, radius = 5000 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const nearby = await prisma.$queryRaw`
      SELECT id, name, latitude, longitude,
             ST_DistanceSphere(
               ST_MakePoint(${Number(lon)}, ${Number(lat)}),
               ST_MakePoint(longitude, latitude)
             ) AS distance
      FROM "Location"
      WHERE ST_DistanceSphere(
               ST_MakePoint(${Number(lon)}, ${Number(lat)}),
               ST_MakePoint(longitude, latitude)
            ) <= ${Number(radius)}
      ORDER BY distance
      LIMIT 40;
    `;

    res.json(nearby);
  } catch (err) {
    console.error("Error fetching nearby locations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/nearby-filter", authenticate, async (req, res) => {
  try {
    const {
      lat,
      lon,
      radius = 5000,
      minBounty,
      maxBounty,
      dateFrom,
      dateTo,
      maxDaysOld,
      petName,
      username,
      pinnedByUserId,
    } = req.query;

    if (!lat || !lon)
      return res.status(400).json({ error: "lat and lon are required" });

    const numericLat = Number(lat);
    const numericLon = Number(lon);
    const numericRadius = Number(radius);

    let query = `
      SELECT 
        l.id AS listing_id,
        l.pet_name,
        l.bounty,
        l.status,
        l.description,
        l.created_at,
        u.username,
        loc.id AS location_id,
        loc.name AS location_name,
        loc.latitude,
        loc.longitude,
        ST_DistanceSphere(
          ST_MakePoint($1, $2),
          ST_MakePoint(loc.longitude, loc.latitude)
        ) AS distance
      FROM "Listing" l
      JOIN "ListingsLocation" ll ON ll.list_id = l.id
      JOIN "Location" loc ON loc.id = ll.location_id
      JOIN "User" u ON u.id = l.user_id
    `;

    const params = [numericLon, numericLat];

    if (pinnedByUserId) {
      query += `
        JOIN "UserPinnedListings" upl 
          ON upl.user_id = l.id 
         AND upl.list_id = $3
      `;
      params.push(pinnedByUserId);
    }

    query += `
      WHERE ST_DistanceSphere(
              ST_MakePoint($1, $2),
              ST_MakePoint(loc.longitude, loc.latitude)
            ) <= $${params.length + 1}
      ORDER BY distance
      LIMIT 40;
    `;
    params.push(numericRadius);

    const listings = await prisma.$queryRawUnsafe(query, ...params);

    const filtered = listings.filter((l) => {
      const matchesBounty =
        (!minBounty || l.bounty >= Number(minBounty)) &&
        (!maxBounty || l.bounty <= Number(maxBounty));
      const matchesPetName =
        !petName ||
        l.pet_name?.toLowerCase().includes(String(petName).toLowerCase());
      const matchesUsername =
        !username ||
        l.username?.toLowerCase().includes(String(username).toLowerCase());
      const matchesMaxDaysOld =
        !maxDaysOld ||
        (l.created_at &&
          new Date(l.created_at) >=
            new Date(Date.now() - Number(maxDaysOld) * 24 * 60 * 60 * 1000));
      const matchesDateFrom =
        !dateFrom ||
        (l.created_at && new Date(l.created_at) >= new Date(dateFrom));
      const matchesDateTo =
        !dateTo || (l.created_at && new Date(l.created_at) <= new Date(dateTo));

      return (
        matchesBounty &&
        matchesPetName &&
        matchesUsername &&
        matchesMaxDaysOld &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    const results = filtered.map((item) => ({
      id: item.location_id,
      name: item.pet_name || item.location_name || "Unnamed",
      latitude: item.latitude,
      longitude: item.longitude,
      bounty: item.bounty,
      status: item.status,
      description: item.description,
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching nearby listings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
