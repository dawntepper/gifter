import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Send, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  message: string;
  message_type: 'user_question' | 'ai_response';
  created_at: string;
  conversation_thread_id: string;
}

interface ConversationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialDescription: string;
  occasion: string;
  budget: number;
}

const ConversationPanel = ({
  isOpen,
  onClose,
  initialDescription,
  occasion,
  budget
}: ConversationPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [threadId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();
  const MAX_FREE_QUESTIONS = 3;

  useEffect(() => {
    checkPremiumStatus();
    loadConversationHistory();
  }, []);

  const checkPremiumStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: premiumData } = await supabase
        .from('premium_users')
        .select('is_premium, daily_question_count')
        .eq('id', user.id)
        .single();

      if (premiumData) {
        setIsPremium(premiumData.is_premium);
        setQuestionCount(premiumData.daily_question_count);
      }
    }
  };

  const loadConversationHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: conversations } = await supabase
        .from('gift_conversations')
        .select('*')
        .eq('conversation_thread_id', threadId)
        .order('created_at', { ascending: true });

      if (conversations) {
        setMessages(conversations);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to continue the conversation.",
        variant: "destructive",
      });
      return;
    }

    if (!isPremium && questionCount >= MAX_FREE_QUESTIONS) {
      toast({
        title: "Question limit reached",
        description: "Upgrade to premium for unlimited questions!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Store user's question
      const { data: questionData, error: questionError } = await supabase
        .from('gift_conversations')
        .insert({
          user_id: user.id,
          message: newMessage,
          message_type: 'user_question',
          conversation_thread_id: threadId
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Update question count for free users
      if (!isPremium) {
        const { error: updateError } = await supabase
          .from('premium_users')
          .update({ daily_question_count: questionCount + 1 })
          .eq('id', user.id);

        if (updateError) throw updateError;
        setQuestionCount(prev => prev + 1);
      }

      // Get AI response using Supabase Edge Function
      const { data: aiResponse, error: functionError } = await supabase.functions.invoke('gift-conversation', {
        body: {
          question: newMessage,
          context: {
            description: initialDescription,
            occasion,
            budget,
            conversationHistory: messages
          }
        }
      });

      if (functionError) throw functionError;

      // Store AI response
      await supabase
        .from('gift_conversations')
        .insert({
          user_id: user.id,
          message: aiResponse.message,
          message_type: 'ai_response',
          parent_message_id: questionData.id,
          conversation_thread_id: threadId
        });

      // Refresh conversation history
      await loadConversationHistory();
      setNewMessage("");
    } catch (error) {
      console.error('Error in conversation:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] h-full flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Gift Conversation Assistant
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-grow mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.message_type === 'user_question'
                    ? 'bg-primary/10 ml-auto max-w-[80%]'
                    : 'bg-secondary/10 mr-auto max-w-[80%]'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {!isPremium && questionCount >= MAX_FREE_QUESTIONS ? (
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
        ) : (
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ConversationPanel;