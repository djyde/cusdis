-- AlterTable
ALTER TABLE "users" ADD COLUMN "displayName" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "pages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("created_at", "id", "projectId", "slug", "title", "updated_at", "url") SELECT "created_at", "id", "projectId", "slug", "title", "updated_at", "url" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
CREATE INDEX "projectId" ON "pages"("projectId");
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "ownerId" TEXT NOT NULL,
    "token" TEXT,
    "fetch_latest_comments_at" DATETIME,
    "enable_notification" BOOLEAN DEFAULT true,
    "webhook" TEXT,
    "enableWebhook" BOOLEAN,
    CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("created_at", "deleted_at", "enableWebhook", "enable_notification", "fetch_latest_comments_at", "id", "ownerId", "title", "token", "updated_at", "webhook") SELECT "created_at", "deleted_at", "enableWebhook", "enable_notification", "fetch_latest_comments_at", "id", "ownerId", "title", "token", "updated_at", "webhook" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "moderatorId" TEXT,
    "by_email" TEXT,
    "by_nickname" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    CONSTRAINT "comments_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("approved", "by_email", "by_nickname", "content", "created_at", "deletedAt", "id", "moderatorId", "pageId", "parentId", "updated_at") SELECT "approved", "by_email", "by_nickname", "content", "created_at", "deletedAt", "id", "moderatorId", "pageId", "parentId", "updated_at" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineIndex
DROP INDEX "accounts.compound_id_unique";
CREATE UNIQUE INDEX "accounts_compound_id_key" ON "accounts"("compound_id");

-- RedefineIndex
DROP INDEX "sessions.access_token_unique";
CREATE UNIQUE INDEX "sessions_access_token_key" ON "sessions"("access_token");

-- RedefineIndex
DROP INDEX "sessions.session_token_unique";
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- RedefineIndex
DROP INDEX "users.email_unique";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- RedefineIndex
DROP INDEX "verification_requests.token_unique";
CREATE UNIQUE INDEX "verification_requests_token_key" ON "verification_requests"("token");
