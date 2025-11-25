import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200
        ${isDark ? 'bg-slate-800/70 border-slate-700 text-slate-100 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'}
      `}
      aria-label={isDark ? '라이트 모드로 변경' : '다크 모드로 변경'}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          isDark ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
      </span>
      <span>{isDark ? '라이트 모드' : '다크 모드'}</span>
    </button>
  );
};

export default ThemeToggle;
