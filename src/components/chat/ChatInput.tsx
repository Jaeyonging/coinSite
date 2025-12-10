import { useRef, useEffect } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  inputRef: externalInputRef,
  autoFocus = false,
}: ChatInputProps) {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus, inputRef]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2 flex-shrink-0">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="메시지를 입력하세요..."
        maxLength={500}
        className="flex-1 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-[20px] text-sm outline-none transition-colors focus:border-[#667eea] dark:focus:border-[#667eea]"
      />
      <button
        onClick={onSend}
        disabled={!value.trim()}
        className="px-5 py-2.5 bg-[#667eea] text-white border-none rounded-[20px] cursor-pointer text-sm font-semibold transition-colors hover:bg-[#5568d3] disabled:bg-slate-300 disabled:cursor-not-allowed min-w-[60px]"
      >
        전송
      </button>
    </div>
  );
}
