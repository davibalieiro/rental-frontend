import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import "./css/Products.css";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/product/${slug}`, {
          credentials: "include",
        });
        const json = await res.json();
        setProduct(json.data);

        // 🔗 carrega produtos relacionados pela categoria principal
        if (json.data?.categories?.length > 0) {
          const categorySlug = json.data.categories[0].slug;
          const relRes = await fetch(
            `http://localhost:3000/api/category/${categorySlug}/products`
          );
          const relJson = await relRes.json();
          setRelatedProducts(relJson.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  if (loadingProduct) return <p>Carregando produto...</p>;
  if (!product) return <p>Produto não encontrado</p>;

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

  const handleWishlist = () => {
    let newWishlist = [...wishlist];
    if (!newWishlist.find((item) => item.slug === product.slug)) {
      newWishlist.push(product);
    } else {
      newWishlist = newWishlist.filter((item) => item.slug !== product.slug);
    }
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setNotification("🔗 Link do produto copiado para área de transferência!");
    setTimeout(() => setNotification(null), 3000);
  };

  const isFavorite = wishlist.some((item) => item.slug === product.slug);

  return (
    <div className="product-page">
      <div className="product-image">
        <img src={product.image || "https://via.placeholder.com/400x400"} alt={product.name} />
        <div className="thumbnail-list">
          {(product.gallery || [product.image]).map((img, i) => (
            <img key={i} src={img} alt={`thumb-${i}`} />
          ))}
        </div>

        {/* ❤️ botão de favoritos e compartilhar */}
        <div className="image-actions">
          <button
            className={`wishlist-icon ${isFavorite ? "active" : ""}`}
            onClick={handleWishlist}
          >
            <FaHeart />
          </button>
          <button className="share-icon" onClick={handleShare}>
            <FaShareAlt />
          </button>
        </div>
      </div>

      <div className="product-details">
        <h1>{product.name}</h1>

        {/* ⭐ Avaliação fake (depois pode vir do backend) */}
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < 4 ? "star filled" : "star"} />
          ))}
          <span>(35 avaliações)</span>
        </div>

        <p className="short-description">{product.short_description}</p>
        <p className="long-description">{product.long_description}</p>
        <p><strong>Dimensão:</strong> {product.dimension}</p>

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
                  <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
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
