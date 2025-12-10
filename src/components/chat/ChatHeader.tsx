interface ChatHeaderProps {
  userCount: number;
  onClose: () => void;
}

export default function ChatHeader({ userCount, onClose }: ChatHeaderProps) {
  return (
    <div className="bg-[#667eea] text-white px-4 py-3.5 flex justify-between items-center flex-shrink-0">
      <div>
        <h3 className="text-lg font-semibold m-0">💬 실시간 채팅</h3>
        <div className="text-xs opacity-90 mt-0.5">
          접속자: <span>{userCount}</span>명
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-white text-2xl cursor-pointer p-0 w-[30px] h-[30px] flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
      >
        ×
      </button>
    </div>
  );
}
