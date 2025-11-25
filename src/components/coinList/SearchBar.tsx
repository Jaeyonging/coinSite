import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder="코인 이름으로 검색"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="bg-white border border-gray-300 rounded-lg text-gray-900 py-3 px-4 text-sm transition-all focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-500 mb-5 w-full max-w-[500px] md:py-2.5 md:px-3.5 md:text-sm md:max-w-full sm:py-2.5 sm:px-3 sm:text-sm sm:mb-4"
    />
  );
};

export default SearchBar;
