interface ChatButtonProps {
  onClick: () => void;
  hasNewMessage: boolean;
}

export default function ChatButton({ onClick, hasNewMessage }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-full bg-[#667eea] border-none cursor-pointer shadow-lg flex items-center justify-center transition-all text-white text-2xl hover:bg-[#5568d3] hover:scale-105 active:scale-95 ${
        hasNewMessage ? 'relative' : ''
      }`}
      title="채팅 열기"
    >
      💬
      {hasNewMessage && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
