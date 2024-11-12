import { useLocation } from 'react-router-dom';
import GiftResults from '@/components/gift/GiftResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations, searchData } = location.state || {};

  const handleRefine = () => {
    navigate('/', { state: searchData });
  };

  if (!recommendations || !searchData) {
    return (
      <div className="w-full bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">No search results available.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>
        
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Gift Recommendations</h1>
            <p className="text-muted-foreground">
              Based on your search for: {searchData.description}
            </p>
          </div>

          <GiftResults
            initialDescription={searchData.description}
            occasion={searchData.occasion}
            budget={searchData.budget}
            recommendations={recommendations}
            onRefine={handleRefine}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;