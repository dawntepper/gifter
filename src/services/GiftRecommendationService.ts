import { RetailerProduct } from './retailers/types';
import { AmazonClient } from './retailers/AmazonClient';
import { generateGiftRecommendations } from './openai';

export interface GiftRecommendation {
  product: RetailerProduct;
  aiReasoning: string;
  confidence: number;
}

export class GiftRecommendationService {
  private retailers = {
    amazon: new AmazonClient(),
    // Add more retailers here as we implement them
  };

  async getRecommendations(
    description: string,
    occasion: string,
    budget: number
  ): Promise<GiftRecommendation[]> {
    // 1. Get AI-generated gift ideas
    const aiSuggestions = await generateGiftRecommendations({
      description,
      occasion,
      budget
    });

    // 2. Search products across all retailers
    const recommendations: GiftRecommendation[] = [];
    
    for (const retailer of Object.values(this.retailers)) {
      try {
        const searchResults = await retailer.search(description, {
          maxPrice: budget
        });

        // 3. Match products with AI suggestions and add reasoning
        searchResults.products.forEach(product => {
          // TODO: Implement matching logic
          recommendations.push({
            product,
            aiReasoning: "AI-generated reasoning will go here",
            confidence: 0.8
          });
        });
      } catch (error) {
        console.error(`Error fetching from retailer:`, error);
      }
    }

    return recommendations;
  }
}

export const giftRecommendationService = new GiftRecommendationService();