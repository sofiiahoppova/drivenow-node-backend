/*
  Warnings:

  - You are about to drop the column `driverLicenseUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passportUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "driverLicenseUrl",
DROP COLUMN "passportUrl",
ADD COLUMN     "driverLicenseSerial" TEXT,
ADD COLUMN     "passportSerial" TEXT;
