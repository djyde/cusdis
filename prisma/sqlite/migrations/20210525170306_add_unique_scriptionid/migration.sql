/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscriptions.subscription_id_unique" ON "subscriptions"("subscription_id");
