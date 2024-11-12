export interface Message {
  id: string;
  message: string;
  message_type: 'user_question' | 'ai_response';
  created_at: string;
  user_id?: string;
  parent_message_id?: string;
  conversation_thread_id: string;
}

export interface ConversationThread {
  id: string;
  user_id: string;
  created_at: string;
  context: {
    description: string;
    occasion: string;
    budget: number;
  };
}