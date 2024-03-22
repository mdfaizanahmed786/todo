import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Todos  from "./pages/Todos";
import { CreateTodos } from "./components/CreateTodos";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Navigation from "./pages/Navigation";
import NotFound from "./pages/NotFound";
import Verify from "./pages/verify";
function App() {
  useEffect(() => {
    // fetcher();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigation />}>
            {/* Render other components here if needed */}
          </Route>
          <Route path ="/verify/:token" element={<Verify/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/notFound" element={<NotFound/>} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
