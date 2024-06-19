export interface KauflandSellerProductApiResponse {
  data: ProductResponse;
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
