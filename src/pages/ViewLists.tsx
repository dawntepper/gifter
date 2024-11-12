import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift, ChevronRight, Trash2 } from "lucide-react";
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

interface GiftList {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  items_count?: number;
}

const ViewLists = () => {
  const [lists, setLists] = useState<GiftList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to view your lists",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('gift_lists')
        .select(`
          *,
          saved_gift_items (count)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const listsWithCount = data.map(list => ({
        ...list,
        items_count: list.saved_gift_items?.[0]?.count || 0
      }));

      setLists(listsWithCount);
    } catch (error) {
      toast({
        title: "Error fetching lists",
        description: "There was a problem loading your gift lists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;

    try {
      const { error } = await supabase
        .from('gift_lists')
        .delete()
        .eq('id', listToDelete);

      if (error) throw error;

      toast({
        title: "List deleted",
        description: "Your gift list has been deleted successfully",
      });

      setLists(lists.filter(list => list.id !== listToDelete));
    } catch (error) {
      toast({
        title: "Error deleting list",
        description: "There was a problem deleting your list",
        variant: "destructive",
      });
    } finally {
      setListToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Gift Lists</h1>
      
      {isLoading ? (
        <div className="text-center">Loading your lists...</div>
      ) : lists.length === 0 ? (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You haven't created any gift lists yet.</p>
          <Button asChild>
            <Link to="/">Start Finding Gifts</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card key={list.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{list.name}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      setListToDelete(list.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Link to={`/lists/${list.id}`}>
                  <p className="text-sm text-muted-foreground">
                    {list.description || "No description"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      {list.items_count} {list.items_count === 1 ? 'item' : 'items'}
                    </span>
                    <div className="flex items-center text-sm text-primary">
                      View List <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!listToDelete} onOpenChange={() => setListToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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

export default ViewLists;