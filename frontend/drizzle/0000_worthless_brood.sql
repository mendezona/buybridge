CREATE TABLE IF NOT EXISTS "buyBridge_Item" (
	"id" serial PRIMARY KEY NOT NULL,
	"productName" varchar(256),
	"ean" varchar(256) NOT NULL,
	"profit" numeric(10, 2),
	"profitUpdatedAt" timestamp with time zone,
	"roi" numeric(10, 2),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"asin" varchar(256),
	"amazonPrice" numeric(10, 2),
	"amazonStockLevel" varchar(256),
	"amazonShippingFee" numeric(10, 2),
	"amazonLink" varchar(256),
	"amazonDataUpdatedAt" timestamp with time zone,
	"kauflandProductId" varchar(256),
	"kauflandPrice" numeric(10, 2),
	"kauflandOffer" varchar(256),
	"kauflandSellerFee" numeric(10, 2),
	"kauflandVat" numeric(10, 2),
	"kauflandVariableFee" numeric(10, 2),
	"kauflandFixedFee" numeric(10, 2),
	"kauflandShippingRate" numeric(10, 2),
	"kauflandLink" varchar(256),
	"kauflandDataUpdatedAt" timestamp with time zone,
	CONSTRAINT "buyBridge_Item_ean_unique" UNIQUE("ean"),
	CONSTRAINT "buyBridge_Item_asin_unique" UNIQUE("asin")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "buyBridge_Listing" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(256),
	"ean" varchar(256) NOT NULL,
	"unitCurrentlyListed" boolean NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "buyBridge_Listing_ean_unique" UNIQUE("ean")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ean_idx" ON "buyBridge_Item" ("ean");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asin_idx" ON "buyBridge_Item" ("asin");