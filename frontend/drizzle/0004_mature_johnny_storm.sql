ALTER TABLE "buyBridge_Item" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "buyBridge_Item" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "buyBridge_Item" ADD COLUMN "productDataLastAttemptedRefreshAt" timestamp with time zone;