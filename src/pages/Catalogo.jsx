import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useProductsContext } from "~/context/ProductsContext";
import { useProductImages } from "~/hooks/useProductImages";
import "./css/Catalogo.css";
import { FaArrowLeft, FaArrowRight, FaCaretLeft, FaCaretRight, FaCheckCircle, FaShoppingBag } from "react-icons/fa";

export default function Catalog() {
  const API_URL = import.meta.env.VITE_API_URL_V1;

  const {
    products,
    pagination,
    loading,
    page,
    setPage,
    perPage,
    setPerPage
  } = useProductsContext();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [added, setAdded] = useState({});
  const navigate = useNavigate();
  const { imageUrls } = useProductImages(products);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/category/all`, {
          credentials: "include",
        });
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Filtra produtos por busca e categoria
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category
      ? p.categories?.some((c) => c.name === category)
      : true;
    return matchesSearch && matchesCategory;
  });

  // Adiciona produto ao carrinho
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setAdded((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAdded((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    }
  };

  // Muda a página de forma segura
  const handlePageChange = (newPage) => {
    const totalPages = pagination?.totalPages || 1;
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
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
          placeholder="🔍 Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Produtos */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <>
          <div className="catalog-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="badge">
                    {product.categories?.[0]?.name || ""}
                  </div>
                  <img
                    src={imageUrls[product.id] ?? '/placeholder.svg'}
                    alt={product.name}
                    loading="lazy"
                    onClick={() => navigate(`/produto/${product.slug}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <h4>{product.name}</h4>
                  <div className="product-actions">
                    <button
                      className="buy-btn"
                      onClick={() => navigate(`/produto/${product.slug}`)}
                    >
                      Ver detalhes
                    </button>
                    <button
                      className="cart-btn"
                      onClick={() => addToCart(product)}
                    >
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
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="page-btn"
            >
              <FaCaretLeft style={{ marginRight: '5px' }} /> Anterior
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
              Próxima <FaCaretRight style={{ marginLeft: '5px' }} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
