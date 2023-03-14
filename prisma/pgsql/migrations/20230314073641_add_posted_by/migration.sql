-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "postById" TEXT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postById_fkey" FOREIGN KEY ("postById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
