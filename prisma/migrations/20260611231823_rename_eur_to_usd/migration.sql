/*
  Warnings:

  - You are about to drop the column `amountEUR` on the `UserOrder` table. All the data in the column will be lost.
  - Added the required column `amountUSD` to the `UserOrder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "packageCode" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "days" INTEGER,
    "amountUSD" REAL NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "esimStatus" TEXT,
    "esimOrderNo" TEXT,
    "esimTranNo" TEXT,
    "iccid" TEXT,
    "qrCodeUrl" TEXT,
    "activationCode" TEXT,
    "smdpAddress" TEXT,
    "matchingId" TEXT,
    "rawStripeSession" TEXT,
    "rawEsimResponse" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UserOrder" ("activationCode", "countryCode", "countryName", "createdAt", "days", "email", "esimOrderNo", "esimStatus", "esimTranNo", "iccid", "id", "matchingId", "packageCode", "packageName", "paymentStatus", "qrCodeUrl", "rawEsimResponse", "rawStripeSession", "smdpAddress", "stripePaymentIntentId", "stripeSessionId", "updatedAt") SELECT "activationCode", "countryCode", "countryName", "createdAt", "days", "email", "esimOrderNo", "esimStatus", "esimTranNo", "iccid", "id", "matchingId", "packageCode", "packageName", "paymentStatus", "qrCodeUrl", "rawEsimResponse", "rawStripeSession", "smdpAddress", "stripePaymentIntentId", "stripeSessionId", "updatedAt" FROM "UserOrder";
DROP TABLE "UserOrder";
ALTER TABLE "new_UserOrder" RENAME TO "UserOrder";
CREATE UNIQUE INDEX "UserOrder_stripeSessionId_key" ON "UserOrder"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
