import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Fetch API credentials from the database
    const { data: credentials, error: credError } = await supabaseClient
      .from('retailer_api_credentials')
      .select('*');

    if (credError) throw credError;

    // Process each retailer in parallel
    const retailerPromises = credentials.map(async (cred) => {
      switch (cred.retailer) {
        case 'amazon':
          return fetchAmazonProducts(cred);
        case 'target':
          return fetchTargetProducts(cred);
        default:
          console.log(`Unsupported retailer: ${cred.retailer}`);
          return [];
      }
    });

    const allProducts = await Promise.all(retailerPromises);
    const flatProducts = allProducts.flat();

    // Update scraped_products table
    const { error: upsertError } = await supabaseClient
      .from('scraped_products')
      .upsert(
        flatProducts.map(p => ({
          store_type: p.retailer,
          product_name: p.name,
          description: p.description,
          price: p.price,
          image_url: p.imageUrl,
          product_url: p.productUrl,
          store_sku: p.sku,
          last_checked_at: new Date().toISOString()
        })),
        { onConflict: 'store_type,store_sku' }
      );

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true, count: flatProducts.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchAmazonProducts(credentials: any) {
  // Implementation using Amazon Product Advertising API
  const response = await fetch('https://webservices.amazon.com/paapi5/searchitems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.api_key}`
    },
    body: JSON.stringify({
      // Amazon API specific parameters
    })
  });

  const data = await response.json();
  // Transform Amazon response to our format
  return data.items.map((item: any) => ({
    retailer: 'amazon',
    name: item.title,
    description: item.description,
    price: parseFloat(item.price.amount),
    imageUrl: item.imageUrl,
    productUrl: item.detailPageUrl,
    sku: item.asin
  }));
}

async function fetchTargetProducts(credentials: any) {
  // Implementation using Target API
  const response = await fetch('https://api.target.com/products/v3/search', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.api_key}`
    }
  });

  const data = await response.json();
  // Transform Target response to our format
  return data.products.map((item: any) => ({
    retailer: 'target',
    name: item.title,
    description: item.description,
    price: item.price.current_retail,
    imageUrl: item.images.primary_url,
    productUrl: `https://target.com${item.url}`,
    sku: item.tcin
  }));
}