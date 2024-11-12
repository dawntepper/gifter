import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, occasion, budget, availableProducts } = await req.json();

    const systemPrompt = `You are a gift recommendation expert. Analyze the available products and select the best matches based on the person's description and occasion. Return exactly 3 recommendations in JSON format.`;

    const userPrompt = `Based on this information:
    - Person Description: ${description}
    - Occasion: ${occasion}
    - Budget: $${budget}
    
    And these available products:
    ${JSON.stringify(availableProducts)}

    Select the 3 best matching products and explain why they would make good gifts.
    Return them as a JSON array where each object has:
    {
      "id": (product's id),
      "name": (product name),
      "description": (product description),
      "price": (price as string with $),
      "image": (product's image_url),
      "aiReasoning": (2-3 sentences explaining why this gift matches),
      "retailer": (store_type),
      "url": (product_url)
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-gift-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});