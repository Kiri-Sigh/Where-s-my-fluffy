/*
  Warnings:

  - Added the required column `image_name` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_listing_id_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "image_name" TEXT NOT NULL,
ALTER COLUMN "listing_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
