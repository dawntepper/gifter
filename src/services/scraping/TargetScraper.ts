import type { Browser, Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import { supabase } from "@/integrations/supabase/client";
import { ScrapedProduct, StoreAvailability, StoreLocation } from "./types";

export class TargetScraper {
  private browser: Browser | null = null;
  private readonly BASE_URL = "https://www.target.com";
  private lastRequestTime: number = 0;
  private readonly MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
  
  private async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
    }
    return this.browser;
  }

  private async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  async scrapeProduct(productUrl: string): Promise<ScrapedProduct> {
    await this.rateLimit();
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    
    try {
      await page.goto(productUrl, { waitUntil: "networkidle0" });
      
      const product = await page.evaluate(() => {
        const priceElement = document.querySelector("[data-test='product-price']");
        const nameElement = document.querySelector("[data-test='product-title']");
        const imageElement = document.querySelector("img[data-test='product-image']") as HTMLImageElement;
        const descriptionElement = document.querySelector("[data-test='product-description']");
        
        const price = priceElement?.textContent?.replace(/[^0-9.]/g, "");
        
        return {
          productName: nameElement?.textContent?.trim() || "",
          price: price ? parseFloat(price) : 0,
          imageUrl: imageElement?.src || "",
          description: descriptionElement?.textContent?.trim() || "",
          productUrl: window.location.href,
          storeSku: new URLSearchParams(window.location.search).get("skuId") || undefined
        };
      });

      return {
        ...product,
        storeType: "target"
      };
    } finally {
      await page.close();
    }
  }

  async checkAvailability(productSku: string, location: StoreLocation): Promise<StoreAvailability> {
    await this.rateLimit();
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    
    try {
      const availabilityUrl = `${this.BASE_URL}/p/store-availability/${productSku}?zip=${location.zipCode}`;
      await page.goto(availabilityUrl, { waitUntil: "networkidle0" });
      
      const availability = await page.evaluate((loc) => {
        const storeElements = document.querySelectorAll("[data-test='store-result']");
        
        for (const store of storeElements) {
          const storeAddress = store.querySelector("[data-test='store-address']")?.textContent;
          if (storeAddress?.includes(loc.address)) {
            const inStock = store.querySelector("[data-test='in-stock']") !== null;
            const quantityText = store.querySelector("[data-test='quantity']")?.textContent;
            const quantity = quantityText ? parseInt(quantityText.match(/\d+/)?.[0] || "0") : undefined;
            
            return {
              inStock,
              quantity
            };
          }
        }
        
        return { inStock: false };
      }, location);

      return {
        location,
        ...availability
      };
    } finally {
      await page.close();
    }
  }

  async saveProduct(product: ScrapedProduct): Promise<void> {
    const { error } = await supabase
      .from("scraped_products")
      .upsert({
        store_type: product.storeType,
        product_name: product.productName,
        description: product.description,
        price: product.price,
        image_url: product.imageUrl,
        product_url: product.productUrl,
        store_sku: product.storeSku,
        last_checked_at: new Date().toISOString()
      }, {
        onConflict: "store_type,store_sku"
      });

    if (error) {
      throw new Error(`Failed to save product: ${error.message}`);
    }
  }

  async saveAvailability(productId: string, availability: StoreAvailability): Promise<void> {
    const { error } = await supabase
      .from("store_availability")
      .upsert({
        product_id: productId,
        store_location: availability.location as any, // Type cast needed due to JSONB storage
        in_stock: availability.inStock,
        quantity: availability.quantity,
        last_checked_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Failed to save availability: ${error.message}`);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}