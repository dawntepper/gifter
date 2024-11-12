import { Database } from "@/integrations/supabase/types";

export type StoreType = Database["public"]["Enums"]["store_type"];

export interface StoreLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface ScrapedProduct {
  storeType: StoreType;
  productName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  productUrl: string;
  storeSku?: string;
}

export interface StoreAvailability {
  location: StoreLocation;
  inStock: boolean;
  quantity?: number;
}