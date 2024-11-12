export interface RetailerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  retailer: string;
  url: string;
  imageUrl: string;
  category: string;
  availability: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface RetailerAPIResponse {
  products: RetailerProduct[];
  totalResults: number;
  hasMore: boolean;
  nextPage?: string;
}

export interface RetailerAPIClient {
  search(query: string, options?: SearchOptions): Promise<RetailerAPIResponse>;
  getProduct(id: string): Promise<RetailerProduct>;
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: 'price' | 'rating' | 'relevance';
}