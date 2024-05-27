import { Suspense, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Home } from "./routes/Home";
import { Socket } from "./routes/Socket";
import { Footer } from "./components/Footer";

function App() {
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
