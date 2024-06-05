// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
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
    asin: varchar("asin", { length: 256 }).unique(),
    fbmSeller: varchar("fbmSeller", { length: 256 }),
    fba: varchar("fba", { length: 256 }),
    amazonPrice: decimal("amazonPrice", { precision: 10, scale: 2 }),
    amazonStockLevel: varchar("amazonStockLevel", { length: 256 }),
    amazonShippingFee: decimal("amazonShippingFee", {
      precision: 10,
      scale: 2,
    }),
    amazonLink: varchar("amazonLink", { length: 256 }),
    kauflandPrice: decimal("kauflandPrice", {
      precision: 10,
      scale: 2,
    }),
    kauflandOffer: varchar("kauflandOffer", { length: 256 }),
    kauflandSellerFee: decimal("kauflandSellerFee", {
      precision: 10,
      scale: 2,
    }),
    kauflandLink: varchar("kauflandLink", { length: 256 }),
    profit: decimal("profit", { precision: 10, scale: 2 }),
    roi: decimal("roi", { precision: 10, scale: 2 }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    kauflandProductId: varchar("kauflandProductId", { length: 256 }),
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
  },
  (item) => ({
    eanIndex: index("ean_idx").on(item.ean),
    asinIndex: index("asin_idx").on(item.asin),
  }),
);
