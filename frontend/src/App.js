import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Homepage from "./components/Homepage"; // Import Homepage component
import "./App.css";
import IntLogin from "./components/IntLogin/IntLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntLogin />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

export default App;
