-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verified" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "indexVM" INTEGER NOT NULL DEFAULT 0,
    "poaps" TEXT NOT NULL DEFAULT '{ }'
);
INSERT INTO "new_Verified" ("address", "indexVM") SELECT "address", "indexVM" FROM "Verified";
DROP TABLE "Verified";
ALTER TABLE "new_Verified" RENAME TO "Verified";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
