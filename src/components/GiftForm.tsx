import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { generateGiftRecommendations } from "@/services/openai";
import { Button } from "@/components/ui/button";
import ConversationPanel from "./gift/ConversationPanel";
import GiftFormInputs from "./gift/GiftFormInputs";
import SaveSearchModal from "./gift/SaveSearchModal";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GiftForm = () => {
  const navigate = useNavigate();
  const [showConversation, setShowConversation] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    occasion: "",
    budget: [50],
    minBudget: "0",
    maxBudget: "5000"
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log("GiftForm mounted");
    checkPremiumStatus();
    return () => console.log("GiftForm unmounted");
  }, []);

  const checkPremiumStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: premiumData } = await supabase
        .from('premium_users')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (premiumData) {
        setIsPremium(premiumData.is_premium);
      }
    }
  };

  const saveRecommendationsToHistory = async (recommendations) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const recommendationsToSave = recommendations.map(rec => ({
      user_id: user.id,
      product_name: rec.name,
      product_url: rec.url,
      platform: rec.retailer || 'Amazon',
      price: parseFloat(rec.price.replace('$', '')),
      platform_specific_data: {
        description: rec.description,
        image_url: rec.image,
        ai_reasoning: rec.aiReasoning
      }
    }));

    const { error } = await supabase
      .from('product_recommendations')
      .insert(recommendationsToSave);

    if (error) {
      console.error('Error saving recommendations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.occasion) {
      toast({
        title: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const recommendations = await generateGiftRecommendations({
        description: formData.description,
        occasion: formData.occasion,
        budget: formData.budget[0],
      });
      
      // Save recommendations to history
      await saveRecommendationsToHistory(recommendations);
      
      const formattedRecommendations = Array.isArray(recommendations) 
        ? recommendations.map(rec => ({
            id: rec.id || Math.random().toString(),
            name: rec.name || '',
            description: rec.description || '',
            price: rec.price || '',
            image: rec.image || '',
            aiReasoning: rec.aiReasoning || '',
            retailer: rec.retailer || 'Amazon',
            url: rec.url || '#'
          }))
        : [];
      
      navigate('/search-results', {
        state: {
          recommendations: formattedRecommendations,
          searchData: {
            description: formData.description,
            occasion: formData.occasion,
            budget: formData.budget[0],
          }
        }
      });
      
      toast({
        title: "Gift Ideas Found! 🎁",
        description: "Here are some personalized gift suggestions based on your input.",
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error finding gift ideas",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-6">
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              Find the Perfect Gift <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </h2>
            <p className="text-sm text-muted-foreground">Tell us about your recipient and we'll help you discover thoughtful gifts they'll love.</p>
          </div>
          <div className="bg-card rounded-lg shadow-sm p-6">
            <GiftFormInputs
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <ConversationPanel
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
        initialDescription={formData.description}
        occasion={formData.occasion}
        budget={formData.budget[0]}
      />

      <SaveSearchModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        searchData={{
          description: formData.description,
          occasion: formData.occasion,
          budget: formData.budget[0],
        }}
      />
    </div>
  );
};

export default GiftForm;