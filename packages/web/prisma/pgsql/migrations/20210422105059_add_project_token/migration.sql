-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "token" TEXT,
ADD COLUMN     "fetch_latest_comments_at" TIMESTAMP(3);
