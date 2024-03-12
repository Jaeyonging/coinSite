import { Suspense, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Home } from "./routes/Home";
import { Chart } from "./routes/Chart";
import { Draw } from "./routes/Draw";
import { Movie } from "./routes/Movie";

function App() {
  return (
    <>
      <Header></Header>
      <Suspense fallback={<div>로딩중</div>}>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/list" element={<Chart/>} />
          <Route path="/draw" element={<Draw/>} />
          <Route path="/movie" element={<Movie/>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
