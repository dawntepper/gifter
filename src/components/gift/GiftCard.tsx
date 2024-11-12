import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, ExternalLink, Heart, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";

export interface GiftCardProps {
  id: string | number;
  name: string;
  description: string;
  price: string;
  image: string;
  aiReasoning: string;
  retailer?: string;
  url?: string;
}

const GiftCard = ({ 
  name, 
  description, 
  price, 
  image, 
  aiReasoning,
  retailer = "Amazon",
  url = "#" 
}: GiftCardProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const { toast } = useToast();

  // Remove any duplicate $ symbols from the price
  const formattedPrice = price.replace(/^\$+/, '$');

  const handleSaveGift = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to save gifts",
          variant: "destructive",
        });
        return;
      }

      const { data: listData, error: listError } = await supabase
        .from('gift_lists')
        .insert({
          name: newListName,
          user_id: user.id
        })
        .select()
        .single();

      if (listError) throw listError;

      const { error: itemError } = await supabase
        .from('saved_gift_items')
        .insert([
          {
            list_id: listData.id,
            name,
            description,
            price: formattedPrice,
            image,
            ai_reasoning: aiReasoning,
            retailer,
            url
          }
        ]);

      if (itemError) throw itemError;

      toast({
        title: "Gift saved!",
        description: `Added to "${newListName}"`,
      });
      setShowSaveDialog(false);
      setNewListName("");
    } catch (error) {
      toast({
        title: "Error saving gift",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden group">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
        />
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            >
              <Heart className="h-5 w-5 text-gray-600" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save to Gift List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="list-name">Create New List</Label>
                <div className="flex gap-2">
                  <Input
                    id="list-name"
                    placeholder="e.g., Brother's Christmas List"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                  <Button onClick={handleSaveGift} disabled={!newListName.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> Create
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              {name}
            </CardTitle>
            <CardDescription>{formattedPrice} · {retailer}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>
        
        <Collapsible open={isReasoningOpen} onOpenChange={setIsReasoningOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center p-2 hover:bg-secondary/10">
              <span className="font-medium">Why We Recommend This</span>
              {isReasoningOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-secondary/20 p-4 rounded-md mt-2 text-foreground">
            <p className="text-sm">{aiReasoning}</p>
          </CollapsibleContent>
        </Collapsible>

        <Button className="w-full group" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View on {retailer}
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GiftCard;
