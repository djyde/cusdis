-- CreateTable
CREATE TABLE "accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "compound_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "email_verified" DATETIME,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
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
    FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("moderatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts.compound_id_unique" ON "accounts"("compound_id");

-- CreateIndex
CREATE INDEX "providerAccountId" ON "accounts"("provider_account_id");

-- CreateIndex
CREATE INDEX "providerId" ON "accounts"("provider_id");

-- CreateIndex
CREATE INDEX "userId" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions.session_token_unique" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions.access_token_unique" ON "sessions"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests.token_unique" ON "verification_requests"("token");

-- CreateIndex
CREATE INDEX "projectId" ON "pages"("projectId");
