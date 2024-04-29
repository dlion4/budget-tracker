-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthHistory" (
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" REAL NOT NULL,
    "expense" REAL NOT NULL DEFAULT 0,

    PRIMARY KEY ("day", "month", "year", "userId")
);
INSERT INTO "new_MonthHistory" ("day", "income", "month", "userId", "year") SELECT "day", "income", "month", "userId", "year" FROM "MonthHistory";
DROP TABLE "MonthHistory";
ALTER TABLE "new_MonthHistory" RENAME TO "MonthHistory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
