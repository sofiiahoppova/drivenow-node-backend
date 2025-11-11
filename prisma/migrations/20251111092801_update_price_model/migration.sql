/*
  Warnings:

  - You are about to drop the column `amount` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Price` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[carClass]` on the table `Price` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carClass` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyPrice` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyPrice` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekendPrice` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeklyPrice` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "amount",
DROP COLUMN "period",
ADD COLUMN     "carClass" "carClass" NOT NULL,
ADD COLUMN     "dailyPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "monthlyPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weekendPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weeklyPrice" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Price_carClass_key" ON "Price"("carClass");
