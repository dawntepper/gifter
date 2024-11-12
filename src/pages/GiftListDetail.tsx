import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import GiftCard from "@/components/gift/GiftCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedGift {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  ai_reasoning: string;
  retailer: string;
  url: string;
  status: 'saved' | 'purchased' | 'archived';
}

const GiftListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [listName, setListName] = useState("");
  const [gifts, setGifts] = useState<SavedGift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showDeleteListDialog, setShowDeleteListDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGiftList();
  }, [listId]);

  const fetchGiftList = async () => {
    try {
      const { data: listData, error: listError } = await supabase
        .from('gift_lists')
        .select('name')
        .eq('id', listId)
        .single();

      if (listError) throw listError;
      setListName(listData.name);

      const { data: giftsData, error: giftsError } = await supabase
        .from('saved_gift_items')
        .select('*')
        .eq('list_id', listId)
        .order('created_at', { ascending: false });

      if (giftsError) throw giftsError;
      setGifts(giftsData);
    } catch (error) {
      toast({
        title: "Error loading gift list",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from('saved_gift_items')
        .delete()
        .eq('id', itemToDelete);

      if (error) throw error;

      toast({
        title: "Item deleted",
        description: "The gift has been removed from your list",
      });

      setGifts(gifts.filter(gift => gift.id !== itemToDelete));
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: "There was a problem removing the gift",
        variant: "destructive",
      });
    } finally {
      setItemToDelete(null);
    }
  };

  const handleDeleteList = async () => {
    try {
      const { error } = await supabase
        .from('gift_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;

      toast({
        title: "List deleted",
        description: "Your gift list has been deleted successfully",
      });

      navigate('/lists');
    } catch (error) {
      toast({
        title: "Error deleting list",
        description: "There was a problem deleting your list",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" asChild>
            <Link to="/lists" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Lists
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteListDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete List
          </Button>
        </div>
        <h1 className="text-2xl font-bold">{listName}</h1>
      </div>

      {gifts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No gifts saved to this list yet.</p>
          <Button asChild>
            <Link to="/">Find Some Gifts</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <div key={gift.id} className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                onClick={() => setItemToDelete(gift.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <GiftCard
                id={gift.id}
                name={gift.name}
                description={gift.description}
                price={gift.price}
                image={gift.image}
                aiReasoning={gift.ai_reasoning}
                retailer={gift.retailer}
                url={gift.url}
              />
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this gift?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the gift from your list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground">
              Delete Gift
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteListDialog} onOpenChange={setShowDeleteListDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete entire list?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this gift list and all its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteList} className="bg-destructive text-destructive-foreground">
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GiftListDetail;