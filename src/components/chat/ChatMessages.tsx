import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Message } from './types';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  currentUsername: string;
}

export interface ChatMessagesRef {
  scrollToBottom: () => void;
}

const ChatMessages = forwardRef<ChatMessagesRef, ChatMessagesProps>(
  ({ messages, currentUsername }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    return (
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.username === currentUsername}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;
