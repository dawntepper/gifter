import { RetailerAPIClient, SearchOptions, RetailerAPIResponse, RetailerProduct } from './types';
import { supabase } from '@/integrations/supabase/client';

export abstract class BaseRetailerClient implements RetailerAPIClient {
  protected abstract retailerName: string;
  protected abstract apiKey: string;
  protected abstract baseUrl: string;

  protected async cacheResponse(key: string, data: any, expirationMinutes: number = 60): Promise<void> {
    const { error } = await supabase
      .from('api_cache')
      .upsert({
        key,
        data,
        expires_at: new Date(Date.now() + expirationMinutes * 60000).toISOString()
      });

    if (error) {
      console.error(`Cache error for ${this.retailerName}:`, error);
    }
  }

  protected async getCachedResponse(key: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('api_cache')
      .select('*')
      .eq('key', key)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    return data.data;
  }

  abstract search(query: string, options?: SearchOptions): Promise<RetailerAPIResponse>;
  abstract getProduct(id: string): Promise<RetailerProduct>;
}