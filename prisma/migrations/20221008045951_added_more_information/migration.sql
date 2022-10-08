-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "chainId" TEXT NOT NULL DEFAULT '0x89',
    "ensName" TEXT NOT NULL DEFAULT '',
    "balance" TEXT NOT NULL DEFAULT '0'
);

-- CreateTable
CREATE TABLE "Verified" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "indexVM" INTEGER NOT NULL DEFAULT 0
);
