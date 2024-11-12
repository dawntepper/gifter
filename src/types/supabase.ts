export type UserPreferences = {
  id: string;
  created_at: string;
  updated_at: string;
  budget_min: number;
  budget_max: number;
  preferred_stores: string[];
};

export type GiftRecommendation = {
  id: string;
  created_at: string;
  user_id: string;
  recipient_description: string;
  occasion: string;
  budget: number;
  recommendations: {
    name: string;
    description: string;
    price: number;
    store: string;
    url: string;
    image_url: string;
  }[];
};

export type SearchHistory = {
  id: string;
  created_at: string;
  user_id: string;
  search_query: string;
  filters: {
    min_price?: number;
    max_price?: number;
    stores?: string[];
    categories?: string[];
  };
};

export type StoreConfig = {
  id: string;
  store_name: string;
  api_endpoint: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};