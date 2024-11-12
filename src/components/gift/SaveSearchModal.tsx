import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchData: {
    description: string;
    occasion: string;
    budget: number;
  };
}

const SaveSearchModal = ({ isOpen, onClose, searchData }: SaveSearchModalProps) => {
  const [recipientName, setRecipientName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!recipientName.trim()) {
      toast({
        title: "Please enter a recipient name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("saved_gift_searches").insert({
        user_id: user.id,
        recipient_name: recipientName,
        description: searchData.description,
        occasion: searchData.occasion,
        budget: searchData.budget,
      });

      if (error) throw error;

      toast({
        title: "Search saved successfully",
        description: `Gift search for ${recipientName} has been saved.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error saving search",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Gift Search</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient Name</Label>
            <Input
              id="recipient"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient's name"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Search"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveSearchModal;