import { useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Message } from './types';
import ChatHeader from './ChatHeader';
import ChatMessages, { ChatMessagesRef } from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  userCount: number;
  currentUsername: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export interface ChatWindowRef {
  scrollToBottom: () => void;
}

const ChatWindow = forwardRef<ChatWindowRef, ChatWindowProps>(
  ({
    isOpen,
    messages,
    userCount,
    currentUsername,
    inputValue,
    onInputChange,
    onSend,
    onClose,
  }, ref) => {
    const chatInputRef = useRef<HTMLInputElement>(null);
    const chatMessagesRef = useRef<ChatMessagesRef>(null);

    const scrollToBottom = useCallback(() => {
      chatMessagesRef.current?.scrollToBottom();
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    useEffect(() => {
      if (isOpen) {
        setTimeout(() => scrollToBottom(), 200);
      }
    }, [isOpen, scrollToBottom]);

    if (!isOpen) return null;

  return (
    <div
      className="chat-window fixed bottom-[76px] right-5 w-[380px] h-[500px] max-h-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded-2xl shadow-lg flex-col overflow-hidden transition-all flex"
      style={{
        position: 'fixed',
      }}
    >
      <ChatHeader userCount={userCount} onClose={onClose} />
      <ChatMessages ref={chatMessagesRef} messages={messages} currentUsername={currentUsername} />
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSend}
        inputRef={chatInputRef}
      />
    </div>
  );
  }
);

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
