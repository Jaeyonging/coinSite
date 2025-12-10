import { Message } from './types';
import { formatTime } from './utils';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <div
      className={`mb-3 animate-[fadeIn_0.3s_ease] flex flex-col ${
        isOwnMessage ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`flex items-center gap-1.5 mb-1 ${
          isOwnMessage ? 'flex-row-reverse' : ''
        }`}
      >
        <span
          className={`text-sm font-semibold ${
            isOwnMessage
              ? 'text-[#667eea] dark:text-[#a5b4fc]'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          {message.username}
        </span>
        <span className="text-[10px] text-slate-500">
          {formatTime(message.timestamp)}
        </span>
      </div>
      <div
        className={`px-3.5 py-2.5 rounded-xl text-sm leading-relaxed break-words max-w-[75%] ${
          isOwnMessage
            ? 'bg-[#667eea] text-white rounded-br-sm shadow-md'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm shadow-sm'
        }`}
      >
        {message.message}
      </div>
    </div>
  );
}
