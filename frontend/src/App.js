import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;