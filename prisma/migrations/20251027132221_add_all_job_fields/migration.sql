-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "salaryMin" REAL,
    "salaryMax" REAL,
    "workType" TEXT DEFAULT 'onsite',
    "currency" TEXT DEFAULT 'GBP',
    "url" TEXT NOT NULL,
    "dateApplied" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "notes" TEXT,
    "tags" TEXT
);
