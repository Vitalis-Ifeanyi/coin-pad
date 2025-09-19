import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import { DarkModeProvider } from "./context/DarkModeContext"
import Analytics from "./pages/Analytics";
import Terms from "./pages/Terms";

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<div className="p-6 flex items-center h-[100vh] justify-center">Page Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
};

export default App;
