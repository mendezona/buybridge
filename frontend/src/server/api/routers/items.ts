import { type Item } from "@prisma/client";
import { z } from "zod";
import { kauflandScrapper } from "~/scraper/kauflandScrapper/kauflandScrapper";
import { detectAndConvertPrice } from "~/scraper/scrapper.helpers";
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
      const authorId = ctx.currentUserId as string | null;
      if (authorId) {
        const kauflandProductData = await kauflandScrapper(input);
        if (kauflandProductData.productFound) {
          await ctx.db.item.upsert({
            where: { ean: input.ean },
            update: {
              productName: kauflandProductData.productName,
              kauflandPrice:
                kauflandProductData.kauflandPrice &&
                detectAndConvertPrice(kauflandProductData.kauflandPrice),
              kauflandLink: kauflandProductData.kauflandLink,
            },
            create: {
              ean: input.ean,
              productName: kauflandProductData.productName,
              kauflandPrice:
                kauflandProductData.kauflandPrice &&
                detectAndConvertPrice(kauflandProductData.kauflandPrice),
              kauflandLink: kauflandProductData.kauflandLink,
            },
          });
        }

        return "Product added to catalogue";
      }

      return "An error occured attempting to add this product to the catalogue";
    }),
});
