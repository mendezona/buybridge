export interface KauflandSellerApiProductDataResponse {
  data: ProductResponse;
}

export interface KauflandSellerApiSignRequestParams {
  method: KauflandSellerApiRequestMethod;
  url: string;
  secretKey: string;
  timestamp: number;
  body?: string;
}

export enum KauflandSellerApiRequestMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
}

export enum KauflandSellerApiDeVatIndicator {
  STANDARD_RATE = "standard_rate",
}

export interface KauflandSellerApiGetProductDataByEANParams {
  ean: string;
}

export interface KauflandProductListing {
  /**
   * The internal Kaufland ID of the product.
   * You must either specify an id_product or ean (or both).
   */
  id_product?: number;

  /**
   * The EAN of the product.
   * You must either specify an id_product or ean (or both).
   */
  ean?: string;

  /**
   * Condition of the product. "NEW" means that the product is not used.
   * Available conditions include: "NEW", "USED___AS_NEW", "USED___VERY_GOOD", "USED___GOOD", "USED___ACCEPTABLE".
   */
  condition: KauflandProductCondition;

  /**
   * The price you would like to sell the product at, in integral cents in the currency of the storefront (CZK or EUR).
   * This value must be greater than zero, with a maximum of 25 million CZK or 1 million EUR.
   */
  listing_price: number;

  /**
   * The minimum price you would be willing to sell at, in integral cents of the storefront currency.
   * If specified, the price of your inventory will be adjusted to increase your buybox position, but not below this price.
   */
  minimum_price?: number;

  /**
   * The number of the product you have in stock. Note that the amount is limited to 99999.
   */
  amount: number;

  /**
   * A note about the product's condition for the customer. Provides extra details for used products.
   * Limited to 250 characters.
   */
  note?: string;

  /**
   * Your internal ID for the unit (offer and unit are synonyms on the Kaufland marketplace).
   * This is used to identify units which should be connected over several storefronts.
   */
  id_offer: string;

  /**
   * The amount of working days till the order is handed over to the carrier.
   * Has to be equal to or greater than zero.
   */
  handling_time: number;

  /**
   * The warehouse ID where the product is located. If not specified, your default warehouse is used.
   */
  id_warehouse: number;

  /**
   * ID of the shipping group the unit should be assigned to.
   */
  id_shipping_group: number;

  /**
   * The storefront parameter indicates on which marketplace the offer should be placed.
   */
  storefront: string;

  /**
   * VAT indicator determining the VAT rate of the unit. Should match the available VAT indicator of the storefront.
   * Refer to the /vat-indicators/ REST API endpoint for the most recent VAT indicator mapping.
   */
  vat_indicator: string;
}

export enum KauflandProductCondition {
  NEW = "NEW",
  USED_AS_NEW = "USED___AS_NEW",
  USED_VERY_GOOD = "USED___VERY_GOOD",
  USED_GOOD = "USED___GOOD",
  USED_ACCEPTABLE = "USED___ACCEPTABLE",
}

export interface ProductResponse {
  id_product: number;
  title: string;
  eans: Record<number, string>;
  id_category: number;
  main_picture: string;
  manufacturer: string;
  url: string;
  category: Category;
  units: Record<number, Unit>;
}

export interface Category {
  id_category: number;
  name: string;
  id_parent_category: number;
  title_singular: string;
  title_plural: string;
  level: number;
  url: string;
  shipping_category: string;
  variable_fee: string;
  fixed_fee: number;
  vat: string;
}

export interface Unit {
  id_unit: number;
  id_product: number;
  condition: string;
  location: string;
  warehouse: string;
  amount: number;
  price: number;
  delivery_time_min: number;
  delivery_time_max: number;
  shipping_group: string | null;
  note: string;
  seller: Seller;
  shipping_rate: number;
}

export interface Seller {
  pseudonym: string;
}

export interface KauflandSellerApiGetUnitsByEANParams {
  ean: string;
  limit?: number;
  offset?: number;
  storefront?: string;
  fulfillment_type?: string;
  embedded?: string;
}

export enum KauflandSellerApiFulfillmentType {
  KAUFLAND = "fulfilled_by_kaufland",
  MERCHANT = "fulfilled_by_merchant",
}

export interface KauflandSellerApiGetUnitByEANResponse {
  data: KauflandSellerApiUnit[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface KauflandSellerApiUnit {
  status: string;
  currency: string;
  transport_time_min: number;
  transport_time_max: number;
  id_unit: number;
  note: string;
  condition: string;
  listing_price: number;
  minimum_price: number;
  price: number;
  id_offer: string;
  id_product: number;
  id_shipping_group: number;
  id_warehouse: number;
  amount: number;
  date_inserted_iso: string;
  date_lastchange_iso: string;
  handling_time: number;
  storefront: string;
  shipping_rate: number;
  fulfillment_type: string;
  vat_indicator: string;
}

export interface KauflandSellerApiDeleteAllUnitsUsingProductIds {
  unitIds: string[];
}
