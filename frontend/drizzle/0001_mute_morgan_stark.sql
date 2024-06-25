ALTER TABLE "buyBridge_Listing" RENAME COLUMN "createdAt" TO "lastUpdatedAt";--> statement-breakpoint
ALTER TABLE "buyBridge_Listing" ADD COLUMN "kauflandUnitId" varchar(256);