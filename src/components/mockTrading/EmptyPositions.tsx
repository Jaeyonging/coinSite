import React from 'react';
import { MdInventory } from 'react-icons/md';

interface EmptyPositionsProps {
  isMobile: boolean;
}

const EmptyPositions = ({ isMobile }: EmptyPositionsProps) => {
  return (
    <div className="text-center py-10 px-5 md:py-[60px] text-gray-500 bg-gray-50 rounded-lg">
      <div className="text-[32px] md:text-[64px] mb-4 flex justify-center">
        <MdInventory className="w-12 h-12 md:w-16 md:h-16 text-gray-500" />
      </div>
      <div className="text-xs md:text-base">보유 중인 종목이 없습니다.</div>
      <div className="text-[10px] md:text-sm mt-2 text-gray-400">
        코인을 클릭하여 모의투자를 시작하세요
      </div>
    </div>
  );
};

export default EmptyPositions;
