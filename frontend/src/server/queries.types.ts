import { type items, type listings } from "./db/schema";

export type Item = typeof items.$inferSelect;

export type Listing = typeof listings.$inferSelect;
