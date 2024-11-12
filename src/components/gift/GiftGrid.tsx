import { GiftCardProps } from "./GiftCard";
import GiftCard from "./GiftCard";

interface GiftGridProps {
  gifts: GiftCardProps[];
}

const GiftGrid = ({ gifts = [] }: GiftGridProps) => {
  console.log("GiftGrid rendering with gifts:", gifts);
  
  // Ensure gifts is always an array and has required properties
  const safeGifts = Array.isArray(gifts) ? gifts.filter(gift => 
    gift && 
    gift.id && 
    gift.name && 
    gift.description && 
    gift.price && 
    gift.image
  ) : [];
  
  if (safeGifts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No valid gift recommendations found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeGifts.map((gift) => (
        <GiftCard key={gift.id} {...gift} />
      ))}
    </div>
  );
};

export default GiftGrid;