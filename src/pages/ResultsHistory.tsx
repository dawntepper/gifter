import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import GiftGrid from "@/components/gift/GiftGrid";
import { Button } from "@/components/ui/button";
import { Filter, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { subDays, subWeeks, subMonths } from "date-fns";

interface PlatformSpecificData {
  description?: string;
  image_url?: string;
  [key: string]: any;
}

const ResultsHistory = () => {
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['product-recommendations', timeFilter],
    queryFn: async () => {
      let query = supabase
        .from('product_recommendations')
        .select(`
          id,
          product_name,
          product_url,
          price,
          platform_specific_data,
          platform,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (timeFilter) {
        let dateLimit;
        switch(timeFilter) {
          case 'today':
            dateLimit = subDays(new Date(), 1);
            break;
          case 'week':
            dateLimit = subWeeks(new Date(), 1);
            break;
          case 'month':
            dateLimit = subMonths(new Date(), 1);
            break;
          case 'three_months':
            dateLimit = subMonths(new Date(), 3);
            break;
        }
        if (dateLimit) {
          query = query.gte('created_at', dateLimit.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data.map(item => {
        const platformData = item.platform_specific_data as PlatformSpecificData;
        return {
          id: item.id,
          name: item.product_name,
          description: platformData?.description || "No description available",
          price: item.price ? `$${item.price}` : "Price not available",
          image: platformData?.image_url || "/placeholder-image.jpg",
          url: item.product_url,
          retailer: item.platform,
          aiReasoning: "Based on your search criteria",
          createdAt: new Date(item.created_at)
        };
      });
    }
  });

  const filteredRecommendations = recommendations?.filter(item => {
    if (!priceFilter) return true;
    const price = parseFloat(item.price.replace('$', ''));
    switch(priceFilter) {
      case 'under25': return price < 25;
      case 'under50': return price < 50;
      case 'under100': return price < 100;
      case 'over100': return price >= 100;
      default: return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold">Results History</h1>
            <p className="text-muted-foreground mt-2">Browse all gift ideas from previous searches</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock size={16} />
                  {timeFilter ? `Last ${timeFilter}` : "All Time"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeFilter(null)}>
                  All Time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('today')}>
                  Last 24 Hours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('week')}>
                  Last Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('month')}>
                  Last Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('three_months')}>
                  Last 3 Months
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  {priceFilter ? `Filter: ${priceFilter}` : "Filter by Price"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriceFilter(null)}>
                  All Prices
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPriceFilter('under25')}>
                  Under $25
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceFilter('under50')}>
                  Under $50
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceFilter('under100')}>
                  Under $100
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceFilter('over100')}>
                  Over $100
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading gift ideas...</div>
        ) : filteredRecommendations?.length ? (
          <GiftGrid gifts={filteredRecommendations} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No gift ideas found. Try adjusting your filters or generate some new ideas!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsHistory;