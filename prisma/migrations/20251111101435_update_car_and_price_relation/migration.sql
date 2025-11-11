/*
  Warnings:

  - You are about to drop the column `carId` on the `Price` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_carId_fkey";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "priceId" INTEGER;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "carId";

-- DropEnum
DROP TYPE "Period";

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;
