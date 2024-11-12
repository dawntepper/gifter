import GiftRecommendations from "../GiftRecommendations";
import FollowUpQuestions from "../FollowUpQuestions";

interface GiftResultsProps {
  initialDescription: string;
  occasion: string;
  budget: number;
  recommendations: any[];
  onRefine: () => void;
}

const GiftResults = ({ initialDescription, occasion, budget, recommendations, onRefine }: GiftResultsProps) => {
  console.log("GiftResults rendering with recommendations:", recommendations);
  
  if (!Array.isArray(recommendations)) {
    console.error("Recommendations is not an array:", recommendations);
    return null;
  }

  const validRecommendations = recommendations.map(rec => ({
    id: rec.id || Math.random().toString(),
    name: rec.name,
    description: rec.description,
    price: rec.price,
    image: rec.image,
    aiReasoning: rec.aiReasoning,
    retailer: rec.retailer || "Amazon",
    url: rec.url || "#"
  }));
  
  return (
    <div className="space-y-8">
      <GiftRecommendations initialRecommendations={validRecommendations} />
      <FollowUpQuestions 
        initialDescription={initialDescription}
        occasion={occasion}
        budget={budget}
        onRefine={onRefine}
      />
    </div>
  );
};

export default GiftResults;