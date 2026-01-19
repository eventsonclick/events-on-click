/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `vendor_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "vendor_profiles" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_slug_key" ON "vendor_profiles"("slug");
