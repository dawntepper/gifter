import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/conversations";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import PremiumUpgrade from "./PremiumUpgrade";

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
        .order('created_at', { ascending: true });

      if (conversations) {
        setMessages(conversations as Message[]);
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
      const response = await fetch('/api/gift-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newMessage,
          context: {
            description: initialDescription,
            occasion,
            budget,
            conversationHistory: messages
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const aiResponse = await response.json();
      
      // Update conversation in database
      await supabase.from('gift_conversations').insert([
        {
          user_id: user.id,
          message: newMessage,
          message_type: 'user_question',
          conversation_thread_id: messages[0]?.conversation_thread_id || crypto.randomUUID()
        }
      ]);

      await supabase.from('gift_conversations').insert([
        {
          user_id: user.id,
          message: aiResponse.message,
          message_type: 'ai_response',
          conversation_thread_id: messages[0]?.conversation_thread_id || crypto.randomUUID()
        }
      ]);

      // Update question count for free users
      if (!isPremium) {
        await supabase
          .from('premium_users')
          .update({ daily_question_count: questionCount + 1 })
          .eq('id', user.id);
        setQuestionCount(prev => prev + 1);
      }

      setNewMessage("");
      await loadConversationHistory();
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

        <MessageList messages={messages} />

        {!isPremium && questionCount >= MAX_FREE_QUESTIONS ? (
          <PremiumUpgrade />
        ) : (
          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ConversationPanel;