import { useState, useRef, useCallback } from 'react';
import ChatButton from './ChatButton';
import ChatWindow, { ChatWindowRef } from './ChatWindow';
import { useChatSocket } from './hooks/useChatSocket';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  
  const chatWindowRef = useRef<ChatWindowRef>(null);

  const handleScrollToBottom = useCallback(() => {
    chatWindowRef.current?.scrollToBottom();
  }, []);

  const { messages, userCount, sendMessage, getUsername } = useChatSocket({
    isOpen,
    onNewMessage: () => setHasNewMessage(true),
    onMessagesLoaded: handleScrollToBottom,
  });

  const handleToggleChat = () => {
    setIsOpen((prev) => !prev);
    setHasNewMessage(false);
    setKeyboardOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setKeyboardOpen(false);
  };

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="chat-widget-container fixed bottom-5 right-5 z-[10000] font-sans">
      <ChatWindow
        ref={chatWindowRef}
        isOpen={isOpen}
        messages={messages}
        userCount={userCount}
        currentUsername={getUsername()}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        onClose={handleClose}
        keyboardOpen={keyboardOpen}
      />
      <ChatButton onClick={handleToggleChat} hasNewMessage={hasNewMessage} />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 480px) {
          .chat-widget-container {
            bottom: 16px !important;
            right: 16px !important;
          }
          
          .chat-widget-container button {
            width: 52px !important;
            height: 52px !important;
            font-size: 22px !important;
          }
          
          .chat-widget-container .chat-window {
            width: calc(100vw - 32px) !important;
            height: 50vh !important;
            max-height: 400px !important;
            bottom: 72px !important;
            right: 16px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
