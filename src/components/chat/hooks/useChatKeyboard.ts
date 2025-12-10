import { useEffect, useRef, useState } from 'react';

interface UseChatKeyboardOptions {
  isOpen: boolean;
  chatInputRef: React.RefObject<HTMLInputElement>;
  chatWindowRef: React.RefObject<HTMLDivElement>;
  onScrollToBottom: () => void;
}

export function useChatKeyboard({
  isOpen,
  chatInputRef,
  chatWindowRef,
  onScrollToBottom,
}: UseChatKeyboardOptions) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const isMobileRef = useRef(window.innerWidth <= 480);
  const initialViewportHeightRef = useRef(
    window.visualViewport ? window.visualViewport.height : window.innerHeight
  );

  useEffect(() => {
    if (!isMobileRef.current) return;

    const chatInput = chatInputRef.current;
    const chatWindow = chatWindowRef.current;
    if (!chatInput || !chatWindow) return;

    let keyboardOpenState = false;

    const updateChatPosition = () => {
      if (!window.visualViewport) {
        const currentHeight = window.innerHeight;
        const heightDiff = initialViewportHeightRef.current - currentHeight;

        if (heightDiff > 150) {
          if (!keyboardOpenState) {
            keyboardOpenState = true;
            setKeyboardOpen(true);
            chatWindow.style.bottom = 'auto';
            chatWindow.style.top = '0';
            chatWindow.style.right = '16px';
            setTimeout(() => onScrollToBottom(), 300);
          }
        } else {
          if (keyboardOpenState) {
            keyboardOpenState = false;
            setKeyboardOpen(false);
            chatWindow.style.bottom = '72px';
            chatWindow.style.top = 'auto';
            chatWindow.style.right = '16px';
          }
        }
      } else {
        const vp = window.visualViewport;
        const heightDiff = initialViewportHeightRef.current - vp.height;

        if (heightDiff > 150) {
          if (!keyboardOpenState) {
            keyboardOpenState = true;
            setKeyboardOpen(true);
            chatWindow.style.bottom = 'auto';
            chatWindow.style.top = '0';
            chatWindow.style.right = '16px';
            chatWindow.style.maxHeight = vp.height + 'px';
            setTimeout(() => onScrollToBottom(), 300);
          } else {
            chatWindow.style.maxHeight = vp.height + 'px';
          }
        } else {
          if (keyboardOpenState) {
            keyboardOpenState = false;
            setKeyboardOpen(false);
            chatWindow.style.bottom = '72px';
            chatWindow.style.top = 'auto';
            chatWindow.style.right = '16px';
            chatWindow.style.maxHeight = '';
          }
        }
      }
    };

    const handleFocus = () => {
      setTimeout(updateChatPosition, 100);
    };

    const handleBlur = () => {
      setTimeout(() => {
        updateChatPosition();
      }, 300);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateChatPosition);
      window.visualViewport.addEventListener('scroll', updateChatPosition);
    }

    window.addEventListener('resize', updateChatPosition);
    chatInput.addEventListener('focus', handleFocus);
    chatInput.addEventListener('blur', handleBlur);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateChatPosition);
        window.visualViewport.removeEventListener('scroll', updateChatPosition);
      }
      window.removeEventListener('resize', updateChatPosition);
      chatInput.removeEventListener('focus', handleFocus);
      chatInput.removeEventListener('blur', handleBlur);
    };
  }, [isOpen, chatInputRef, chatWindowRef, onScrollToBottom]);

  return keyboardOpen;
}
