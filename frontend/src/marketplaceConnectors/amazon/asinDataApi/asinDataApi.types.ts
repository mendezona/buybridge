import { z } from "zod";

export interface AmazonProductData {
  productFound: boolean;
  amazonTitle?: string | null;
  amazonPrice?: string | null;
  amazonLink?: string | null;
}

export const asinDataProductDataApiResponseSchema = z.object({
  request_info: z
    .object({
      success: z.boolean().optional(),
      credits_used: z.number().optional(),
      credits_used_this_request: z.number().optional(),
      credits_remaining: z.number().optional(),
      credits_reset_at: z.string().optional(),
    })
    .optional(),
  request_parameters: z
    .object({
      type: z.string().optional(),
      amazon_domain: z.string().optional(),
      asin: z.string().optional(),
    })
    .optional(),
  request_metadata: z
    .object({
      created_at: z.string().optional(),
      processed_at: z.string().optional(),
      total_time_taken: z.number().optional(),
      amazon_url: z.string().optional(),
    })
    .optional(),
  product: z
    .object({
      title: z.string().optional(),
      search_alias: z
        .object({
          title: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
      keywords: z.string().optional(),
      keywords_list: z.array(z.string()).optional(),
      asin: z.string().optional(),
      link: z.string().optional(),
      brand: z.string().optional(),
      sell_on_amazon: z.boolean().optional(),
      categories: z
        .array(
          z.object({
            name: z.string().optional(),
            link: z.string().optional(),
            category_id: z.string().optional(),
          }),
        )
        .optional(),
      description: z.string().optional(),
      a_plus_content: z
        .object({
          has_a_plus_content: z.boolean().optional(),
          has_brand_story: z.boolean().optional(),
          brand_story: z
            .object({
              title: z.string().optional(),
              hero_image: z.string().optional(),
              description: z.string().optional(),
              brand_store: z
                .object({
                  link: z.string().optional(),
                  id: z.string().optional(),
                })
                .optional(),
              images: z.array(z.string()).optional(),
              products: z
                .array(
                  z.object({
                    title: z.string().optional(),
                    asin: z.string().optional(),
                    link: z.string().optional(),
                    image: z.string().optional(),
                  }),
                )
                .optional(),
            })
            .optional(),
          third_party: z.boolean().optional(),
        })
        .optional(),
      sub_title: z
        .object({
          text: z.string().optional(),
          link: z.string().optional(),
        })
        .optional(),
      amazons_choice: z
        .object({
          keywords: z.string().optional(),
          link: z.string().optional(),
        })
        .optional(),
      rating: z.number().optional(),
      rating_breakdown: z
        .object({
          five_star: z
            .object({
              percentage: z.number().optional(),
              count: z.number().optional(),
            })
            .optional(),
          four_star: z
            .object({
              percentage: z.number().optional(),
              count: z.number().optional(),
            })
            .optional(),
          three_star: z
            .object({
              percentage: z.number().optional(),
              count: z.number().optional(),
            })
            .optional(),
          two_star: z
            .object({
              percentage: z.number().optional(),
              count: z.number().optional(),
            })
            .optional(),
          one_star: z
            .object({
              percentage: z.number().optional(),
              count: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
      ratings_total: z.number().optional(),
      reviews_total: z.number().optional(),
      main_image: z
        .object({
          link: z.string().optional(),
        })
        .optional(),
      images: z
        .array(
          z.object({
            link: z.string().optional(),
            variant: z.string().optional(),
          }),
        )
        .optional(),
      images_count: z.number().optional(),
      videos: z
        .array(
          z.object({
            duration_seconds: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            link: z.string().optional(),
            thumbnail: z.string().optional(),
            is_hero_video: z.boolean().optional(),
            variant: z.string().optional(),
            group_id: z.string().optional(),
            group_type: z.string().optional(),
            title: z.string().optional(),
          }),
        )
        .optional(),
      videos_count: z.number().optional(),
      has_360_view: z.boolean().optional(),
      is_bundle: z.boolean().optional(),
      feature_bullets: z.array(z.string()).optional(),
      feature_bullets_count: z.number().optional(),
      feature_bullets_flat: z.string().optional(),
      important_information: z
        .object({
          sections: z
            .array(
              z.object({
                title: z.string().optional(),
                body: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
      attributes: z
        .array(
          z.object({
            name: z.string().optional(),
            value: z.string().optional(),
          }),
        )
        .optional(),
      top_reviews: z
        .array(
          z.object({
            id: z.string().optional(),
            title: z.string().optional(),
            body: z.string().optional(),
            body_html: z.string().optional(),
            link: z.string().optional(),
            rating: z.number().optional(),
            date: z
              .object({
                raw: z.string().optional(),
                utc: z.string().optional(),
              })
              .optional(),
            profile: z
              .object({
                name: z.string().optional(),
                link: z.string().optional(),
                id: z.string().optional(),
                image: z.string().optional(),
              })
              .optional(),
            vine_program: z.boolean().optional(),
            verified_purchase: z.boolean().optional(),
            images: z
              .array(
                z.object({
                  link: z.string().optional(),
                }),
              )
              .optional(),
            helpful_votes: z.number().optional(),
            review_country: z.string().optional(),
            is_global_review: z.boolean().optional(),
          }),
        )
        .optional(),
      buybox_winner: z
        .object({
          offer_id: z.string().optional(),
          new_offers_count: z.number().optional(),
          new_offers_from: z
            .object({
              symbol: z.string().optional(),
              value: z.number().optional(),
              currency: z.string().optional(),
              raw: z.string().optional(),
            })
            .optional(),
          is_prime: z.boolean().optional(),
          is_amazon_fresh: z.boolean().optional(),
          condition: z
            .object({
              is_new: z.boolean().optional(),
            })
            .optional(),
          availability: z
            .object({
              type: z.string().optional(),
              raw: z.string().optional(),
              dispatch_days: z.number().optional(),
            })
            .optional(),
          fulfillment: z
            .object({
              type: z.string().optional(),
              standard_delivery: z
                .object({
                  date: z.string().optional(),
                  name: z.string().optional(),
                })
                .optional(),
              fastest_delivery: z
                .object({
                  date: z.string().optional(),
                  name: z.string().optional(),
                })
                .optional(),
              is_sold_by_amazon: z.boolean().optional(),
              is_fulfilled_by_amazon: z.boolean().optional(),
              is_fulfilled_by_third_party: z.boolean().optional(),
              is_sold_by_third_party: z.boolean().optional(),
            })
            .optional(),
          price: z
            .object({
              symbol: z.string().optional(),
              value: z.number().optional(),
              currency: z.string().optional(),
              raw: z.string().optional(),
            })
            .optional(),
          rrp: z
            .object({
              symbol: z.string().optional(),
              value: z.number().optional(),
              currency: z.string().optional(),
              raw: z.string().optional(),
            })
            .optional(),
          shipping: z
            .object({
              raw: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      more_buying_choices: z
        .array(
          z.object({
            price: z
              .object({
                symbol: z.string().optional(),
                value: z.number().optional(),
                currency: z.string().optional(),
                raw: z.string().optional(),
              })
              .optional(),
            seller_name: z.string().optional(),
            position: z.number().optional(),
            free_shipping: z.boolean().optional(),
          }),
        )
        .optional(),
      specifications: z
        .array(
          z.object({
            name: z.string().optional(),
            value: z.string().optional(),
          }),
        )
        .optional(),
      specifications_flat: z.string().optional(),
      bestsellers_rank: z
        .array(
          z.object({
            category: z.string().optional(),
            rank: z.number().optional(),
            link: z.string().optional(),
          }),
        )
        .optional(),
      release_date: z.string().optional(),
      manufacturer: z.string().optional(),
      weight: z.string().optional(),
      dimensions: z.string().optional(),
      model_number: z.string().optional(),
      recommended_age: z.string().optional(),
      bestsellers_rank_flat: z.string().optional(),
    })
    .optional(),
  brand_store: z
    .object({
      id: z.string().optional(),
      link: z.string().optional(),
    })
    .optional(),
  frequently_bought_together: z
    .object({
      total_price: z
        .object({
          symbol: z.string().optional(),
          value: z.number().optional(),
          currency: z.string().optional(),
          raw: z.string().optional(),
        })
        .optional(),
      products: z
        .array(
          z.object({
            asin: z.string().optional(),
            title: z.string().optional(),
            link: z.string().optional(),
            image: z.string().optional(),
            price: z
              .object({
                symbol: z.string().optional(),
                value: z.number().optional(),
                currency: z.string().optional(),
                raw: z.string().optional(),
              })
              .optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  shop_by_look: z
    .object({
      items: z
        .array(
          z.object({
            position: z.number().optional(),
            asin: z.string().optional(),
            link: z.string().optional(),
            title: z.string().optional(),
            image: z.string().optional(),
            rating: z.number().optional(),
            ratings_total: z.number().optional(),
            is_prime: z.boolean().optional(),
            price: z
              .object({
                symbol: z.string().optional(),
                value: z.number().optional(),
                currency: z.string().optional(),
                raw: z.string().optional(),
              })
              .optional(),
          }),
        )
        .optional(),
      title: z.string().optional(),
    })
    .optional(),
});
