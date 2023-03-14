-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_pageId_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_ownerId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "displayName" TEXT;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "accounts.compound_id_unique" RENAME TO "accounts_compound_id_key";

-- RenameIndex
ALTER INDEX "sessions.access_token_unique" RENAME TO "sessions_access_token_key";

-- RenameIndex
ALTER INDEX "sessions.session_token_unique" RENAME TO "sessions_session_token_key";

-- RenameIndex
ALTER INDEX "users.email_unique" RENAME TO "users_email_key";

-- RenameIndex
ALTER INDEX "verification_requests.token_unique" RENAME TO "verification_requests_token_key";
