-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_ibfk_2`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_ibfk_1`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_ibfk_3`;

-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `pages_ibfk_1`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_ibfk_1`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `displayName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_moderatorId_fkey` FOREIGN KEY (`moderatorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `accounts.compound_id_unique` TO `accounts_compound_id_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions.access_token_unique` TO `sessions_access_token_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions.session_token_unique` TO `sessions_session_token_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `users.email_unique` TO `users_email_key`;

-- RenameIndex
ALTER TABLE `verification_requests` RENAME INDEX `verification_requests.token_unique` TO `verification_requests_token_key`;
