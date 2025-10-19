-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
