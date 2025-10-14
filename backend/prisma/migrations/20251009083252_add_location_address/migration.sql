-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "location_address" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "read_already" BOOLEAN NOT NULL DEFAULT false;
