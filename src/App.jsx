import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext"; // ✅ importar provider
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Empresa from "./pages/Empresa";
import Catalogo from "./pages/Catalogo";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import AdminPainel from "./pages/admin/AdminPainel";
import InfoCard from "./components/InfoCard";
import Termos from "./components/Termo_de_uso";
import Privacidade from "./components/Privacidade";
import FAQ from "./components/FAQ";
import Regulamento from "./components/Regulamento";
import Produto from './pages/Product';
import CartPage from "./pages/CartPage";
import Perfil from "./pages/perfil/Perfil";
import Favorites from "./pages/perfil/Favoritos";   // se você tiver a página de favoritos
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
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
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/admin" element={<AdminPainel />} />

                {/* Extras */}
                <Route path="/InfoCard" element={<InfoCard />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/regulamento" element={<Regulamento />} />

                <Route path="/cartpage" element={<CartPage />} />
                <Route path="/produto/:slug" element={<Produto />} />
                <Route path="/favoritos" element={<Favorites />} /> {/* ✅ rota para favoritos */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>

    </UserProvider>

  );
}

export default App;
