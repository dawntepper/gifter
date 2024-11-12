import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Clock, ShoppingBag } from "lucide-react";
import { StoreLocation } from "@/services/scraping/types";

interface StoreAvailabilityProps {
  storeName: string;
  location: StoreLocation;
  inStock: boolean;
  quantity?: number;
  lastChecked: Date;
}

const StoreAvailability = ({
  storeName,
  location,
  inStock,
  quantity,
  lastChecked,
}: StoreAvailabilityProps) => {
  const timeAgo = formatDistanceToNow(lastChecked, { addSuffix: true });

  return (
    <Alert className="my-4">
      <div className="flex items-start space-x-4">
        <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold mb-2">{storeName}</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {location.address}, {location.city}, {location.state} {location.zipCode}
              </p>
              
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span className={inStock ? "text-green-600" : "text-red-600"}>
                    {inStock ? (
                      quantity ? `${quantity} in stock` : "In stock"
                    ) : (
                      "Out of stock"
                    )}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Checked {timeAgo}</span>
                </div>
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default StoreAvailability;