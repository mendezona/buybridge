export interface AmazonProductData {
  productFound: boolean;
  amazonPrice?: string | null;
  amazonLink?: string | null;
}

export interface AmazonProductResponse {
  request_info: {
    success: boolean;
    credits_used: number;
    credits_remaining: number;
  };
  request_parameters: {
    type: string;
    amazon_domain: string;
    asin: string;
  };
  request_metadata: {
    created_at: string;
    processed_at: string;
    total_time_taken: number;
    amazon_url: string;
  };
  product: {
    title: string;
    search_alias: {
      title: string;
      value: string;
    };
    keywords: string;
    keywords_list: string[];
    asin: string;
    link: string;
    brand: string;
    sell_on_amazon: boolean;
    categories: {
      name: string;
      link: string;
      category_id: string;
    }[];
    description: string;
    a_plus_content: {
      has_a_plus_content: boolean;
      has_brand_story: boolean;
      brand_story: {
        title: string;
        hero_image: string;
        description: string;
        brand_store: {
          link: string;
          id: string;
        };
        images: string[];
        products: {
          title: string;
          asin: string;
          link: string;
          image: string;
        }[];
      };
      third_party: boolean;
    };
    sub_title: {
      text: string;
      link: string;
    };
    amazons_choice: {
      keywords: string;
      link: string;
    };
    rating: number;
    rating_breakdown: {
      five_star: { percentage: number; count: number };
      four_star: { percentage: number; count: number };
      three_star: { percentage: number; count: number };
      two_star: { percentage: number; count: number };
      one_star: { percentage: number; count: number };
    };
    ratings_total: number;
    reviews_total: number;
    main_image: { link: string };
    images: { link: string; variant: string }[];
    images_count: number;
    videos: {
      duration_seconds: number;
      width: number;
      height: number;
      link: string;
      thumbnail: string;
      is_hero_video: boolean;
      variant: string;
      group_id: string;
      group_type: string;
      title: string;
    }[];
    videos_count: number;
    has_360_view: boolean;
    is_bundle: boolean;
    feature_bullets: string[];
    feature_bullets_count: number;
    feature_bullets_flat: string;
    important_information: {
      sections: { title: string; body: string }[];
    };
    attributes: { name: string; value: string }[];
    top_reviews: {
      id: string;
      title: string;
      body: string;
      body_html: string;
      link: string;
      rating: number;
      date: { raw: string; utc: string };
      profile: { name: string; link: string; id: string; image?: string };
      vine_program: boolean;
      verified_purchase: boolean;
      images: { link: string }[];
      helpful_votes: number;
      review_country: string;
      is_global_review: boolean;
    }[];
    buybox_winner: {
      maximum_order_quantity: { value: number; hard_maximum: boolean };
      minimum_order_quantity: { value: number; message: string };
      offer_id: string;
      new_offers_count: number;
      new_offers_from: {
        symbol: string;
        value: number;
        currency: string;
        raw: string;
      };
      is_prime: boolean;
      is_amazon_fresh: boolean;
      condition: { is_new: boolean };
      availability: { type: string; raw: string; dispatch_days: number };
      fulfillment: {
        type: string;
        standard_delivery: { date: string; name: string };
        fastest_delivery: { date: string; name: string };
        is_sold_by_amazon: boolean;
        is_fulfilled_by_amazon: boolean;
        is_fulfilled_by_third_party: boolean;
        is_sold_by_third_party: boolean;
      };
      price: { symbol: string; value: number; currency: string; raw: string };
      rrp: { symbol: string; value: number; currency: string; raw: string };
      shipping: { raw: string };
    };
    more_buying_choices: {
      price: { symbol: string; value: number; currency: string; raw: string };
      seller_name: string;
      position: number;
      free_shipping?: boolean;
    }[];
    specifications: { name: string; value: string }[];
    specifications_flat: string;
    bestsellers_rank: {
      category: string;
      rank: number;
      link: string;
    }[];
    release_date: string;
    manufacturer: string;
    weight: string;
    dimensions: string;
    model_number: string;
    recommended_age: string;
    bestsellers_rank_flat: string;
  };
  brand_store: {
    id: string;
    link: string;
  };
  frequently_bought_together: {
    total_price: {
      symbol: string;
      value: number;
      currency: string;
      raw: string;
    };
    products: {
      asin: string;
      title: string;
      link: string;
      image: string;
      price: { symbol: string; value: number; currency: string; raw: string };
    }[];
  };
  sponsored_products: {
    title: string;
    asin: string;
    link: string;
    image: string;
    rating: number;
    ratings_total: number;
    is_prime: boolean;
    price: { symbol: string; value: number; currency: string; raw: string };
  }[];
  also_viewed: {
    title: string;
    link: string;
    image: string;
    rating: number;
    ratings_total: number;
    is_prime: boolean;
    price: { symbol: string; value: number; currency: string; raw: string };
  }[];
  bundles: {
    asin: string;
    title: string;
    link: string;
    image: string;
    rating: number;
    ratings_total: number;
    item_count: number;
    price: { value: number; currency: string; raw: string };
  }[];
  bundle_contents: {
    asin: string;
    title: string;
    link: string;
    image: string;
    rating: number;
    ratings_total: number;
    item_count: number;
    price: { symbol: string; value: number; currency: string; raw: string };
  }[];
  shop_by_look: {
    title: string;
    items: {
      asin: string;
      link: string;
      title: string;
      image: string;
      is_prime: boolean;
      price: { symbol: string; currency: string; value: number; raw: string };
      ratings_total?: number;
    }[];
  };
}
