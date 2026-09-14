-- CreateTable
CREATE TABLE "SiteStat" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "totalViews" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Heartbeat" (
    "sessionId" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Heartbeat_pkey" PRIMARY KEY ("sessionId")
);

-- CreateIndex
CREATE INDEX "Heartbeat_lastSeen_idx" ON "Heartbeat"("lastSeen");

-- Seed the singleton stats row
INSERT INTO "SiteStat" ("id", "totalViews") VALUES (1, 0);
