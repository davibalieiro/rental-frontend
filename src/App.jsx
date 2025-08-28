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
import InfoCard from "./components/InfoCard";
import Termos from "./components/Termo_de_uso";
import Privacidade from "./components/Privacidade";
import FAQ from "./components/FAQ";
import Regulamento from "./components/Regulamento";

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Header />
        <main>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Páginas principais */}
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />

            {/* Extras */}
            <Route path="/InfoCard" element={<InfoCard />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/regulamento" element={<Regulamento />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
