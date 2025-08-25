import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Empresa from "./pages/Empresa";
import Catalogo from "./pages/Catalogo";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="font-sans">
      {/* Renderização condicional */}
      {isAdmin ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      ) : (
        <>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/empresa" element={<Empresa />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
