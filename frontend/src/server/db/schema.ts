// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `buyBridge_${name}`);

export const items = createTable(
  "Item",
  {
    id: serial("id").primaryKey(),
    productName: varchar("productName", { length: 256 }),
    ean: varchar("ean", { length: 256 }).unique().notNull(),
    profit: decimal("profit", { precision: 10, scale: 2 }),
    profitUpdatedAt: timestamp("profitUpdatedAt", { withTimezone: true }),
    roi: decimal("roi", { precision: 10, scale: 2 }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    productDataLastAttemptedRefreshAt: timestamp("createdAt", {
      withTimezone: true,
    }),
    asin: varchar("asin", { length: 256 }).unique(),
    amazonPrice: decimal("amazonPrice", { precision: 10, scale: 2 }),
    amazonStockLevel: varchar("amazonStockLevel", { length: 256 }),
    amazonShippingFee: decimal("amazonShippingFee", {
      precision: 10,
      scale: 2,
    }),
    amazonLink: varchar("amazonLink", { length: 256 }),
    amazonDataUpdatedAt: timestamp("amazonDataUpdatedAt", {
      withTimezone: true,
    }),
    kauflandProductId: varchar("kauflandProductId", { length: 256 }),
    kauflandPrice: decimal("kauflandPrice", {
      precision: 10,
      scale: 2,
    }),
    kauflandOffer: varchar("kauflandOffer", { length: 256 }),
    kauflandSellerFee: decimal("kauflandSellerFee", {
      precision: 10,
      scale: 2,
    }),
    kauflandVat: decimal("kauflandVat", { precision: 10, scale: 2 }),
    kauflandVariableFee: decimal("kauflandVariableFee", {
      precision: 10,
      scale: 2,
    }),
    kauflandFixedFee: decimal("kauflandFixedFee", { precision: 10, scale: 2 }),
    kauflandShippingRate: decimal("kauflandShippingRate", {
      precision: 10,
      scale: 2,
    }),
    kauflandLink: varchar("kauflandLink", { length: 256 }),
    kauflandDataUpdatedAt: timestamp("kauflandDataUpdatedAt", {
      withTimezone: true,
    }),
  },
  (item) => ({
    eanIndex: index("ean_idx").on(item.ean),
    asinIndex: index("asin_idx").on(item.asin),
  }),
);

export const listings = createTable("Listing", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 256 }),
  ean: varchar("ean", { length: 256 }).notNull(),
  kauflandUnitId: varchar("kauflandUnitId", { length: 256 }),
  unitCurrentlyListed: boolean("unitCurrentlyListed").notNull(),
  lastUpdatedAt: timestamp("lastUpdatedAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
