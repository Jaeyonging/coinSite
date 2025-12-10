import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import CoinListPage from "./pages/CoinListPage";
import Footer from "./components/layout/Footer";
import ReactGA from 'react-ga4';
import ChatWidget from "./components/chat/ChatWidget";

const TRACKING_ID = import.meta.env.VITE_GA_PROPERTYID;

function App() {
  const location = useLocation();

  useEffect(() => {
    if (TRACKING_ID) {
      ReactGA.initialize(TRACKING_ID);
    }
  }, [TRACKING_ID]);

  useEffect(() => {
    if (!TRACKING_ID) return;
    ReactGA.set({ page: location.pathname });
    ReactGA.send('pageview');
  }, [location, TRACKING_ID]);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="text-left py-6 px-6 max-w-[1400px] mx-auto w-full box-border md:px-3 md:py-4 sm:px-2 sm:py-2.5">
        <Header />
        <Suspense fallback={<div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400">로딩중</div>}>
          <Routes>
            <Route path="/" element={<CoinListPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
      <ChatWidget />
    </div>
  );
}

export default App;
