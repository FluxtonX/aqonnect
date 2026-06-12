-- CreateTable
CREATE TABLE "UserOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "packageCode" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "days" INTEGER,
    "amountEUR" REAL NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "UserOrder_stripeSessionId_key" ON "UserOrder"("stripeSessionId");
