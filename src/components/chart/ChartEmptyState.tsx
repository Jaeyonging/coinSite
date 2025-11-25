import React from 'react';

const ChartEmptyState = () => {
  return (
    <div className="py-10 px-5 text-center bg-white rounded-lg shadow-sm mt-3 border border-gray-300">
      <div className="text-[32px] mb-3">📉</div>
      <div className="text-[15px] text-gray-500 font-medium">
        데이터가 없습니다.
      </div>
    </div>
  );
};

export default ChartEmptyState;
