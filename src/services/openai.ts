import { supabase } from "@/integrations/supabase/client";

export interface GiftPrompt {
  description: string;
  occasion: string;
  budget: number;
}

export const generateGiftRecommendations = async (prompt: GiftPrompt) => {
  console.log("Generating recommendations with prompt:", prompt); // Debug log

  // First, fetch relevant products from our database
  const { data: products, error: productsError } = await supabase
    .from('scraped_products')
    .select('*')
    .lt('price', prompt.budget)
    .order('last_checked_at', { ascending: false })
    .limit(20);

  if (productsError) {
    console.error('Error fetching products:', productsError);
    throw productsError;
  }

  console.log("Fetched products:", products); // Debug log

  // Use OpenAI to analyze and select the best matches
  const { data, error } = await supabase.functions.invoke('generate-gift-recommendations', {
    body: {
      ...prompt,
      availableProducts: products
    }
  });

  if (error) {
    console.error('Error calling gift recommendations function:', error);
    throw error;
  }

  console.log("OpenAI response:", data); // Debug log

  // Extract recommendations array from response
  const recommendations = data?.recommendations || [];

  // Map the data to match the GiftCardProps interface
  return recommendations.map(item => ({
    id: item.id || Math.random().toString(),
    name: item.name || item.product_name,
    description: item.description,
    price: item.price ? `$${item.price}` : 'Price not available',
    image: item.image || item.image_url,
    aiReasoning: item.aiReasoning || item.reasoning,
    retailer: item.retailer || 'Amazon',
    url: item.url || item.product_url
  }));
};