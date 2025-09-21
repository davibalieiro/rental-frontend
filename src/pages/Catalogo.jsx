import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useProductsContext } from "~/context/ProductsContext";
import { useProductImages } from "~/hooks/useProductImages";
import "./css/Catalogo.css";
import { FaCaretLeft, FaCaretRight, FaCheckCircle, FaShoppingBag } from "react-icons/fa";

export default function Catalog() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const { products, pagination, loading, page, setPage, setFilters, filters } = useProductsContext();
  const [categories, setCategories] = useState([]);

  // Estados locais para controlar os inputs de forma independente
  const [searchInput, setSearchInput] = useState(filters.name || "");
  const [categoryInput, setCategoryInput] = useState(filters.category || "");

  const [added, setAdded] = useState({});
  const navigate = useNavigate();
  const { imageUrls } = useProductImages(products);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/category/all`, { credentials: "include" });
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Efeito para atualizar os filtros quando a categoria mudar
  useEffect(() => {
    // Evita a busca inicial desnecessária se categoryInput já estiver vazio
    if (categoryInput !== (filters.category || '')) {
      handleSearch();
    }
  }, [categoryInput]);

  const handleSearch = () => {
    setFilters({
      name: searchInput,
      category: categoryInput,
    });
    setPage(1);
  };

  // 1. Adicionada função para pesquisar com a tecla "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 3. Adicionada função para limpar os filtros
  const handleClearFilters = () => {
    setSearchInput("");
    setCategoryInput("");
    setFilters({});
    setPage(1);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.find((item) => item.id === product.id)) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setAdded((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAdded((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    }
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="catalog-container">
      <h1>Catálogo</h1>

      {/* Filtros */}
      <div className="catalog-filters">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Pesquisar</button>
        <button onClick={handleClearFilters} className="clear-btn">Limpar Filtros</button>
      </div>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <>
          <div className="catalog-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <img
                    src={imageUrls[product.id] ?? "/placeholder.svg"}
                    alt={product.name}
                    loading="lazy"
                    onClick={() => navigate(`/produto/${product.slug}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <h4>{product.name}</h4>
                  <div className="product-actions">
                    <button className="buy-btn" onClick={() => navigate(`/produto/${product.slug}`)}>
                      Ver detalhes
                    </button>
                    <button className="cart-btn" onClick={() => addToCart(product)}>
                      {added[product.id] ? (
                        <span><FaCheckCircle /> Adicionado!</span>
                      ) : (
                        <span><FaShoppingBag /> Adicionar</span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum produto encontrado</p>
            )}
          </div>

          {/* Paginação */}
          {products.length > 0 && totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="page-btn">
                <FaCaretLeft style={{ marginRight: "5px" }} /> Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="page-btn"
              >
                Próxima <FaCaretRight style={{ marginLeft: "5px" }} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}