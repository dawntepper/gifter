import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GiftFormInputsProps {
  formData: {
    description: string;
    occasion: string;
    budget: number[];
    minBudget: string;
    maxBudget: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const GiftFormInputs = ({ formData, setFormData, onSubmit, isLoading }: GiftFormInputsProps) => {
  const handleMinBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || parseInt(value) < 0) {
      setFormData({ ...formData, minBudget: '0', budget: [0] });
    } else {
      const numValue = parseInt(value);
      setFormData({ 
        ...formData, 
        minBudget: value,
        budget: numValue <= parseInt(formData.maxBudget) ? [numValue] : formData.budget
      });
    }
  };

  const handleMaxBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || parseInt(value) < parseInt(formData.minBudget)) {
      setFormData({ ...formData, maxBudget: formData.minBudget });
    } else {
      setFormData({ ...formData, maxBudget: value });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-4">
        <label className="block text-lg font-medium text-foreground">
          Describe who you're buying for
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about their interests, hobbies, personality, and what makes them special..."
          className="h-32 text-base"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-foreground">Occasion</label>
        <Select 
          value={formData.occasion} 
          onValueChange={(value) => setFormData({ ...formData, occasion: value })}
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder="Select occasion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birthday">Birthday</SelectItem>
            <SelectItem value="anniversary">Anniversary</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-foreground">Budget Range</label>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-foreground">Min ($)</label>
            <Input
              type="text"
              value={formData.minBudget}
              onChange={handleMinBudgetChange}
              className="mt-1"
              placeholder="Min budget"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-foreground">Max ($)</label>
            <Input
              type="text"
              value={formData.maxBudget}
              onChange={handleMaxBudgetChange}
              className="mt-1"
              placeholder="Max budget"
            />
          </div>
        </div>
        <div className="pt-2">
          <Slider
            value={formData.budget}
            onValueChange={(value) => setFormData({ ...formData, budget: value })}
            max={parseInt(formData.maxBudget)}
            min={parseInt(formData.minBudget)}
            step={10}
            className="w-full"
          />
          <div className="text-center text-sm text-foreground mt-2">
            Selected Budget: ${formData.budget[0]}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full py-6 text-lg font-medium rounded-xl bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Finding Perfect Gifts...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Gift className="mr-2 h-5 w-5" />
            Discover Perfect Gifts
          </div>
        )}
      </Button>
    </form>
  );
};

export default GiftFormInputs;