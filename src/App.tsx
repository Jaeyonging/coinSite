import { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Home } from "./routes/Home";
import { Socket } from "./routes/Socket";
import { Footer } from "./components/Footer";
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
          <Route path="/" element={<Home></Home>} />
          <Route path="/socket" element={<Socket />} />
        </Routes>
      </Suspense>
      <Footer></Footer>

    </>
  );
}

export default App;
