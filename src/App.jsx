import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Empresa from "./pages/Empresa";
import Catalogo from "./pages/Catalogo";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Admin from "./pages/admin/AdminPainel";
import InfoPage from "./components/InfoCard";

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/termos" element={<InfoPage title="Termos de Uso" />} />
            <Route path="/privacidade" element={<InfoPage title="Política de Privacidade" />} />
            <Route path="/faq" element={<InfoPage title="FAQ" />} />
            <Route path="/regulamento" element={<InfoPage title="Regulamento" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;