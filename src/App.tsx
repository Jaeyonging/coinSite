import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import CoinListPage from "./pages/CoinListPage";
import Footer from "./components/layout/Footer";
import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA_PROPERTYID;
ReactGA.initialize(TRACKING_ID);

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.send('pageview');
  }, [location]);
  return (
    <div className="text-left py-6 px-6 max-w-[1400px] mx-auto w-full box-border md:px-3 md:py-4 sm:px-2 sm:py-2.5">
      <Header />
      <Suspense fallback={<div className="text-center py-10">로딩중</div>}>
        <Routes>
          <Route path="/" element={<CoinListPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
