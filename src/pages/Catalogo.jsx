import React, { useState, useEffect } from "react";
import "./css/Catalogo.css";
import { useNavigate } from "react-router";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      let urls = {};
      for (const product of products) {
        try {
          const res = await fetch(`http://localhost:3000/api/product/${product.id}/image`, {
            credentials: "include",
          });
          const data = await res.json();
          urls[product.id] = data.sasToken;
        } catch (err) {
          urls[product.id] = "https://via.placeholder.com/300x200";
        }
      }
      setImageUrls(urls);
    };

    if (products.length > 0) {
      fetchImages();
    }
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/product/all", {
          credentials: "include"
        });
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/category/all", {
          credentials: "include"
        });
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category
        ? p.categories.some((c) => c.name === category)
        : true)
    );
  });

  return (
    <div className="catalog-container">
      <h1>Catálogo</h1>

      {/* FILTROS */}
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

      {/* LISTAGEM */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={imageUrls[product.id] || "https://via.placeholder.com/300x200"}
                  alt={product.name}
                />
                <h4>{product.name}</h4>
                <p className="price">R$ {product.price?.toFixed(2)}</p>
                <button
                  className="buy-btn"
                  onClick={() => navigate(`/produto/${product.slug}`)}
                >
                  Ver detalhes
                </button>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado</p>
          )}
        </div>
      )}
    </div>
  );
}
