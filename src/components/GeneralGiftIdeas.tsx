import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface GeneralGiftIdeasProps {
  isPremiumUser?: boolean;
}

const generalGiftCategories = [
  {
    id: "1",
    category: "Tech Enthusiast",
    ideas: [
      "Smart Home Devices",
      "Wireless Earbuds",
      "Portable Chargers",
      "Gaming Accessories"
    ],
    priceRange: "$25 - $200",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: "2",
    category: "Wellness & Self-Care",
    ideas: [
      "Essential Oil Diffusers",
      "Spa Gift Sets",
      "Fitness Trackers",
      "Meditation Apps Subscription"
    ],
    priceRange: "$15 - $150",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
  },
  {
    id: "3",
    category: "Creative Soul",
    ideas: [
      "Art Supply Sets",
      "Digital Drawing Tablets",
      "Craft Subscription Boxes",
      "Photography Accessories"
    ],
    priceRange: "$20 - $180",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f"
  }
];

const GeneralGiftIdeas = ({ isPremiumUser = false }: GeneralGiftIdeasProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleUpgradeClick = () => {
    if (isPremiumUser) {
      // For premium users, this button should do something else
      toast({
        title: "Coming Soon",
        description: "Specific recommendations for this category will be available soon!",
      });
      return;
    }

    toast({
      title: "Premium Feature",
      description: "Get personalized AI recommendations with our premium plan!",
      action: (
        <Button 
          variant="default" 
          onClick={() => window.location.href = "/premium"}
          className="bg-primary text-white"
        >
          Upgrade Now
        </Button>
      ),
    });
  };

  const filteredCategories = selectedCategory
    ? generalGiftCategories.filter(cat => cat.category === selectedCategory)
    : generalGiftCategories;

  return (
    <div id="gift-categories" className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-4">Popular Gift Categories</h2>
        <p className="text-gray-600 mb-4">Browse our curated gift categories for inspiration</p>
        <div className="flex justify-center gap-4 items-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedCategory || "Filter by Category"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {generalGiftCategories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.category)}
                >
                  {category.category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {!isPremiumUser && (
            <Button 
              onClick={handleUpgradeClick}
              className="bg-primary hover:bg-opacity-90"
            >
              Get AI-Powered Personalized Recommendations
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={category.image}
              alt={category.category}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{category.category}</h3>
              <p className="text-sm text-gray-500 mb-2">Price Range: {category.priceRange}</p>
              <ul className="space-y-2 mb-4">
                {category.ideas.map((idea, index) => (
                  <li key={index} className="text-gray-600 text-sm">• {idea}</li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleUpgradeClick}
              >
                {isPremiumUser ? "View Category Details" : "Get Specific Recommendations"} <ExternalLink size={16} className="ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneralGiftIdeas;