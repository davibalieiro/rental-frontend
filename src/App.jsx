import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Empresa from "./pages/Empresa";
import Catalogo from "./pages/Catalogo";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  return hash || "home";
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
        {page === "login" ? (
          <Login navigate={navigate} />
        ) : page === "home" ? (
          <Home />
        ) : page === "empresa" ? (
          <Empresa />
        ) : page === "catalogo" ? (
          <Catalogo />
        ) : page === "contato" ? (
          <Contato />
        ) : page === "admin" ? (
          <Admin />
        ) : (
          <Home />
        )}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
