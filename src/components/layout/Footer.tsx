import React from 'react';

const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center my-[60px] mx-auto mb-5 w-full max-w-[1400px] rounded-2xl border border-slate-200/70 bg-white/80 py-10 px-8 text-center shadow-md backdrop-blur transition-colors md:py-7 md:px-[18px] md:my-10 md:mb-4 sm:py-5 sm:px-3 sm:my-8 sm:mb-3 sm:rounded-xl dark:border-slate-800 dark:bg-slate-900/70">
      <div className="text-[15px] leading-[2] text-slate-600 md:text-[13px] md:leading-[1.8] sm:text-[11px] sm:leading-[1.7] dark:text-slate-300">
        <div className="text-lg font-bold text-slate-900 mb-3 md:text-[17px] md:mb-2.5 sm:text-[15px] sm:mb-2 dark:text-white">만든이: Jaeyonging</div>
        <div>Feel free to contact me</div>
        <div>Email: wodyd1318@naver.com</div>
        <div className="flex flex-row justify-center items-center gap-2 mt-2 md:flex-wrap md:gap-1.5 sm:flex-col sm:items-center sm:gap-1 sm:mt-1.5">
          <div>GitHub:</div>
          <div>
            <a className="ml-2 text-center text-base font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 hover:underline md:text-sm sm:text-xs sm:ml-0 dark:text-slate-300 dark:hover:text-white" href="https://github.com/Jaeyonging">
              Jaeyonging
            </a>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 mt-2 md:flex-wrap md:gap-1.5 sm:flex-col sm:items-center sm:gap-1 sm:mt-1.5">
          <div>LinkedIn:</div>
          <div>
            <a className="ml-2 text-center text-base font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 hover:underline md:text-sm sm:text-xs sm:ml-0 dark:text-slate-300 dark:hover:text-white" href="https://www.linkedin.com/in/jaeyong-choi-a38b86268/">
              Jaeyong
            </a>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 mt-2 md:flex-wrap md:gap-1.5 sm:flex-col sm:items-center sm:gap-1 sm:mt-1.5">
          <div>Portfolio:</div>
          <div>
            <a className="ml-2 text-center text-base font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 hover:underline md:text-sm sm:text-xs sm:ml-0 dark:text-slate-300 dark:hover:text-white" href="https://jaeyonging.com/">
              Jaeyong
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
