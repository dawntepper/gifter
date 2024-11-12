import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const PremiumUpgrade = () => {
  return (
    <div className="bg-primary/5 p-4 rounded-lg mb-4">
      <div className="flex items-center gap-2 text-primary mb-2">
        <Crown className="w-5 h-5" />
        <h4 className="font-semibold">Upgrade to Premium</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        You've reached your daily limit of free questions. Upgrade to premium for unlimited conversations!
      </p>
      <Button className="w-full" variant="default">
        Upgrade Now
      </Button>
    </div>
  );
};

export default PremiumUpgrade;