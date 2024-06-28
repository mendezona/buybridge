import * as Sentry from "@sentry/nextjs";
import { refreshProductData } from "~/app/actions/refreshProductDataCronJobs";
import { kauflandSellerApiGetProductDataByEAN } from "~/marketplaceConnectors/kaufland/kauflandSellerApi/kauflandSellerApi";

export async function POST(_request: Request) {
  const productEANs = [
    "4047025642972",
    "4026947097114",
    "194253397472",
    "0010942218647",
    "4006581020846",
    "3016661156014",
    "0190199098572",
  ];
  console.log("API called - testendpoint");
  try {
    // Example order flow for adding and deleting a unit on Kaufland
    const ean = "3016661156014";
    // await kauflandSellerApiGetProductDataByEAN({ ean });
    // await kauflandSellerApiCreateNewUnit({
    //   amount: 1,
    //   handling_time: 100,
    //   listing_price: 100,
    //   minimum_price: 100,
    //   note: "string",
    //   ean: ean,
    //   condition: KauflandProductCondition.NEW,
    //   id_offer: "AB12345",
    //   vat_indicator: KauflandSellerApiDeVatIndicator.STANDARD_RATE,
    //   id_warehouse: 38112,
    //   id_shipping_group: 48927,
    //   storefront: KAUFLAND_DE_STOREFRONT,
    // });
    // await kauflandUpdateListedUnitsToDatabaseForAUser("1", ean, true);
    // await kauflandRemoveListedUnitsForASingleUser("1", ean);
    // await kauflandSellerApiGetUnitsByEAN({ ean });

    await refreshProductData(productEANs);

    // await kauflandSellerApiGetProductDataByEAN(ean);

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching comparison table data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
