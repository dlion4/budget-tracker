-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_YearHistory" (
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" REAL NOT NULL,
    "expense" REAL NOT NULL DEFAULT 0,

    PRIMARY KEY ("month", "year", "userId")
);
INSERT INTO "new_YearHistory" ("income", "month", "userId", "year") SELECT "income", "month", "userId", "year" FROM "YearHistory";
DROP TABLE "YearHistory";
ALTER TABLE "new_YearHistory" RENAME TO "YearHistory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
