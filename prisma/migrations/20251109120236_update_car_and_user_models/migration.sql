/*
  Warnings:

  - You are about to drop the column `class` on the `Car` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - A unique constraint covering the columns `[serialNumber]` on the table `Car` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carClass` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "carClass" AS ENUM ('economy', 'compact', 'midsize', 'SUV', 'premium');

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "class",
ADD COLUMN     "carClass" "carClass" NOT NULL,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(30);

-- DropEnum
DROP TYPE "Class";

-- CreateIndex
CREATE UNIQUE INDEX "Car_serialNumber_key" ON "Car"("serialNumber");
