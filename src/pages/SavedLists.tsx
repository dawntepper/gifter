import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gift, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface GiftList {
  id: string;
  name: string;
  created_at: string;
}

const SavedLists = () => {
  const [lists, setLists] = useState<GiftList[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from('gift_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching lists",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLists(data || []);
  };

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`);
  };

  return (
    <div className="w-full bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Gift Lists</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New List
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card 
              key={list.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleListClick(list.id)}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Gift className="h-4 w-4 text-muted-foreground mr-2" />
                <CardTitle className="text-lg font-medium">{list.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mt-2 text-sm text-primary">
                  View List <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedLists;