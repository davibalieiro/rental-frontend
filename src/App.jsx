import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Empresa from "./pages/Empresa";
import Catalogo from "./pages/Catalogo";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const PAGES = {
  home: <Home />,
  empresa: <Empresa />,
  catalogo: <Catalogo />,
  contato: <Contato />,
  login: <Login />,
  admin: <Admin />,
};

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  return PAGES[hash] ? hash : "home";
}

function App() {
  const [page, setPage] = useState(getPageFromHash());

  useEffect(() => {
    function onHashChange() {
      setPage(getPageFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function navigate(to) {
    window.location.hash = to;
  }

  const isAdmin = page === "admin";

  return (
    <div className="font-sans">
      {!isAdmin && <Header navigate={navigate} />}
      <main>
        {PAGES[page]}
      </main>
      {!isAdmin && <Footer />}
      <nav style={{ margin: 16 }}>
        <button onClick={() => navigate("home")}>Home</button>
        <button onClick={() => navigate("empresa")}>Empresa</button>
        <button onClick={() => navigate("catalogo")}>Catálogo</button>
        <button onClick={() => navigate("contato")}>Contato</button>
        <button onClick={() => navigate("login")}>Login</button>
      </nav>
    </div>
  );
}

export default App;
