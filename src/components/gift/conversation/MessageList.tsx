import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/conversations";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
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
  );
};

export default MessageList;