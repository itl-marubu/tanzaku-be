-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TanzakuTxt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "textLine1" TEXT NOT NULL,
    "textLine2" TEXT,
    "nameLine" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "shown" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    CONSTRAINT "TanzakuTxt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TanzakuTxt" ("createdAt", "createdBy", "disabled", "id", "locked", "nameLine", "projectId", "textLine1", "textLine2", "updatedAt") SELECT "createdAt", "createdBy", "disabled", "id", "locked", "nameLine", "projectId", "textLine1", "textLine2", "updatedAt" FROM "TanzakuTxt";
DROP TABLE "TanzakuTxt";
ALTER TABLE "new_TanzakuTxt" RENAME TO "TanzakuTxt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
