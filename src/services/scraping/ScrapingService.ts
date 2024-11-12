import { TargetScraper } from "./TargetScraper";
import { StoreType, StoreLocation } from "./types";

export class ScrapingService {
  private targetScraper: TargetScraper;

  constructor() {
    this.targetScraper = new TargetScraper();
  }

  async scrapeProductAndAvailability(
    storeType: StoreType,
    productUrl: string,
    location: StoreLocation
  ) {
    try {
      switch (storeType) {
        case "target": {
          const product = await this.targetScraper.scrapeProduct(productUrl);
          if (!product.storeSku) {
            throw new Error("Could not find product SKU");
          }
          
          await this.targetScraper.saveProduct(product);
          
          const availability = await this.targetScraper.checkAvailability(
            product.storeSku,
            location
          );
          
          await this.targetScraper.saveAvailability(product.storeSku, availability);
          
          return {
            product,
            availability
          };
        }
        default:
          throw new Error(`Scraping for ${storeType} not implemented yet`);
      }
    } catch (error) {
      console.error("Scraping error:", error);
      throw error;
    }
  }

  async cleanup() {
    await this.targetScraper.close();
  }
}

export const scrapingService = new ScrapingService();