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
      className="mb-5 w-full max-w-[500px] rounded-xl border border-slate-200 bg-white/80 py-3 px-4 text-sm text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400 md:py-2.5 md:px-3.5 md:text-sm md:max-w-full sm:py-2.5 sm:px-3 sm:text-sm sm:mb-4 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
    />
  );
};

export default SearchBar;
