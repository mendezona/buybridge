import { type Item } from "@prisma/client";
import { z } from "zod";
import { kauflandScrapper } from "~/scraper/kauflandScrapper";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.item.findMany() as Promise<Item[]>;
  }),
  submitNewProductEAN: privateProcedure
    .input(
      z.object({
        ean: z.string().regex(/^\d{12,13}$/, {
          message: "EAN must be a 12 or 13 digit number.",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return "Product added to catelogue";
    }),
});
