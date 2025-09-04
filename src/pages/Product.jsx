// src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import "./css/Products.css";
import { useProductImage } from "~/hooks/useProductImages";
import { useFavorites } from "../hooks/useFavorites";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const { productImgUrl } = useProductImage(product);
  const [notification, setNotification] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [favCount, setFavCount] = useState(0);

  // Hook de favoritos
  const { favorites, toggleFavorite, fetchFavorites } = useFavorites(user?.id);

  // Carregar produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/product/${slug}`, {
          credentials: "include",
        });
        const json = await res.json();
        setProduct(json.data);

        if (json.data?.categories?.length > 0) {
          const categorySlug = json.data.categories[0].slug;
          const relRes = await fetch(
            `http://localhost:3000/api/category/${categorySlug}/products`
          );
          const relJson = await relRes.json();
          setRelatedProducts(relJson.data || []);
        }

        // contador de favoritos
        if (json.data?.id) {
          const favRes = await fetch(
            `http://localhost:3000/api/favorites/product/${json.data.id}`
          );
          const favJson = await favRes.json();
          setFavCount(favJson.data || 0);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loadingProduct) return <p>Carregando produto...</p>;
  if (!product) return <p>Produto não encontrado</p>;

  // Adicionar/Remover favoritos
  const handleWishlist = async () => {
    if (!user) {
      alert("Você precisa estar logado para salvar favoritos!");
      navigate("/login");
      return;
    }

    const isFav = favorites.some((f) => f.product?.id === product.id);
    await toggleFavorite(product.id);

    setNotification(
      isFav
        ? "❌ Produto removido dos favoritos"
        : "❤️ Produto adicionado aos favoritos"
    );

    // atualizar contador
    try {
      const favRes = await fetch(
        `http://localhost:3000/api/favorites/product/${product.id}`
      );
      const favJson = await favRes.json();
      setFavCount(favJson.data || 0);
    } catch (err) {
      console.error("Erro ao atualizar contador de favoritos:", err);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  // Orçamento
  const handleAddToCart = () => {
    if (!user) {
      alert("Você precisa estar logado para fazer um orçamento!");
      navigate("/login");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...product, selectedQuantity });
    localStorage.setItem("cart", JSON.stringify(cart));

    setNotification(`✅ ${selectedQuantity}x ${product.name} adicionado ao carrinho!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Compartilhar
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setNotification("🔗 Link do produto copiado!");
    setTimeout(() => setNotification(null), 3000);
  };

  const isFavorite = favorites.some((f) => f.product?.id === product.id);

  return (
    <div className="product-page">
      <div className="product-image">
        <img
          src={productImgUrl || "https://via.placeholder.com/400x400"}
          alt={product.name}
        />
        <div className="thumbnail-list">
          {(product.gallery || [productImgUrl]).map((img, i) => (
            <img key={i} src={img} alt={`thumb-${i}`} />
          ))}
        </div>

        {/* ❤️ Favoritar / Compartilhar */}
        <div className="image-actions">
          <button
            className={`wishlist-icon ${isFavorite ? "active" : ""}`}
            onClick={handleWishlist}
          >
            <FaHeart /> {favCount}
          </button>
          <button className="share-icon" onClick={handleShare}>
            <FaShareAlt />
          </button>
        </div>
      </div>

      <div className="product-details">
        <h1>{product.name}</h1>

        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < 4 ? "star filled" : "star"} />
          ))}
          <span>(35 avaliações)</span>
        </div>

        <p className="short-description">{product.short_description}</p>
        <p className="long-description">{product.long_description}</p>
        <p>
          <strong>Dimensão:</strong> {product.dimension}
        </p>

        {product.categories?.length > 0 && (
          <div className="product-categories">
            <strong>Categorias:</strong>{" "}
            {product.categories.map((cat, i) => (
              <span key={cat.id || i}>
                <Link to={`/categoria/${cat.slug}`}>{cat.name}</Link>
                {i < product.categories.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}

        {product.materials?.length > 0 && (
          <div className="product-materials">
            <strong>Materiais:</strong>{" "}
            {product.materials.map((mat, i) => (
              <span key={mat.id || i}>
                {mat.name}
                {i < product.materials.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}

        <div className="actions">
          <button className="buy-btn" onClick={handleAddToCart}>
            Fazer Orçamento
          </button>
        </div>

        {notification && <div className="notification">{notification}</div>}
      </div>

      {/* 🔗 Produtos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Produtos Relacionados</h2>
          <div className="related-list">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="related-card">
                <Link to={`/produto/${p.slug}`}>
                  <img
                    src={p.image || "https://via.placeholder.com/200"}
                    alt={p.name}
                  />
                  <p>{p.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
