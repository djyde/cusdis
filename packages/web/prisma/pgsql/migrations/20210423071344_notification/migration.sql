-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "enable_notification" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "enable_new_comment_notification" BOOLEAN DEFAULT true,
ADD COLUMN     "notification_email" TEXT;
