-- CreateTable
CREATE TABLE "Streamer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "email" TEXT NOT NULL,
    "currentBid" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "vatNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streamer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_slug_key" ON "Streamer"("slug");

-- CreateIndex
CREATE INDEX "Streamer_status_currentBid_idx" ON "Streamer"("status", "currentBid");

-- CreateIndex
CREATE INDEX "Streamer_category_idx" ON "Streamer"("category");

-- CreateIndex
CREATE INDEX "Streamer_email_idx" ON "Streamer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_stripeSessionId_key" ON "Bid"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Bid_streamerId_idx" ON "Bid"("streamerId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
