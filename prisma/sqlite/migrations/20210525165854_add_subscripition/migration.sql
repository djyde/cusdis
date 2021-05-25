-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "cancel_url" TEXT NOT NULL,
    "update_url" TEXT NOT NULL,
    "billing_email" TEXT NOT NULL,
    "pass_through" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "next_bill_date" DATETIME NOT NULL,
    "cancellation_effective_date" DATETIME,
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions.userId_unique" ON "subscriptions"("userId");
