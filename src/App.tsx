import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header/Header";
import CoinListPage from "./pages/CoinListPage";
import Footer from "./components/common/Footer/Footer";
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
    <>
      <Header></Header>
      <Suspense fallback={<div>로딩중</div>}>
        <Routes>
          <Route path="/" element={<CoinListPage />} />
        </Routes>
      </Suspense>
      <Footer></Footer>

    </>
  );
}

export default App;
