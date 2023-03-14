-- AlterTable
ALTER TABLE "users" ADD COLUMN "enable_new_comment_notification" BOOLEAN DEFAULT true;
ALTER TABLE "users" ADD COLUMN "notification_email" TEXT;
