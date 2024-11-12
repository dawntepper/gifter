import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateGiftRecommendations } from "@/services/openai";

const FollowUpQuestions = ({ initialDescription, occasion, budget, onRefine }: { 
  initialDescription: string;
  occasion: string;
  budget: number;
  onRefine: () => void;
}) => {
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) {
      toast({
        title: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const enhancedDescription = `${initialDescription} Additional context: ${followUpQuestion}`;
      const recommendations = await generateGiftRecommendations({
        description: enhancedDescription,
        occasion,
        budget,
      });
      
      const event = new CustomEvent('updateGiftRecommendations', {
        detail: recommendations
      });
      window.dispatchEvent(event);
      
      setFollowUpQuestion("");
      onRefine(); // Open the conversation panel
    } catch (error) {
      toast({
        title: "Error updating recommendations",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Need help refining these suggestions?</h3>
      <form onSubmit={handleFollowUp} className="space-y-4">
        <Textarea
          value={followUpQuestion}
          onChange={(e) => setFollowUpQuestion(e.target.value)}
          placeholder="Ask a follow-up question to refine the recommendations (e.g., 'What if they prefer outdoor activities?' or 'Can you suggest more budget-friendly options?')"
          className="h-24"
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Updating Recommendations..." : "Refine Suggestions"}
        </Button>
      </form>
    </div>
  );
};

export default FollowUpQuestions;