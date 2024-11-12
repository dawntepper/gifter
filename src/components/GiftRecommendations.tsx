import React from "react";
import { useToast } from "@/components/ui/use-toast";
import GiftGrid from "./gift/GiftGrid";
import { GiftCardProps } from "./gift/GiftCard";
import { Loader2 } from "lucide-react";

interface GiftRecommendationsProps {
  initialRecommendations?: GiftCardProps[];
}

const GiftRecommendations = ({ initialRecommendations = [] }: GiftRecommendationsProps) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = React.useState<GiftCardProps[]>(initialRecommendations);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    console.log("GiftRecommendations received initialRecommendations:", initialRecommendations);
    if (Array.isArray(initialRecommendations) && initialRecommendations.length > 0) {
      setRecommendations(initialRecommendations);
    }
  }, [initialRecommendations]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 mt-8 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Analyzing your request and finding perfect matches...</p>
      </div>
    );
  }

  // Show a message when there are no recommendations
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No gift recommendations available yet.</p>
      </div>
    );
  }

  console.log("Rendering GiftGrid with recommendations:", recommendations);
  return (
    <div className="space-y-6 mt-8">
      <GiftGrid gifts={recommendations} />
    </div>
  );
};

export default GiftRecommendations;