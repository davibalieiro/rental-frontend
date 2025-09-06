import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaHeart, FaShareAlt, FaStar, FaPlus, FaMinus } from "react-icons/fa";
import { useProductImage } from "../hooks/useProductImages";
import { useFavoritesContext } from "../context/FavoritesContext";
import "./css/Products.css";
import { useUserContext } from "~/context/UserContext";

export default function ProductPage() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { localFavorites, addOrRemoveFavorite, loadingToggle } = useFavoritesContext();

  const [product, setProduct] = useState(null);
  const { productImgUrl } = useProductImage(product);
  const [mainImg, setMainImg] = useState(productImgUrl);
  const [notification, setNotification] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [quantity, setQuantity] = useState(1); // quantidade inicial

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/product/${slug}`, { credentials: "include" });
        const json = await res.json();
        const prod = json.data?.product || null;
        setProduct(prod);
        setMainImg(prod?.image || productImgUrl);
        setFavCount(json.data?.totalFavorites ?? 0);
        setRatingCount(json.data?.totalRating ?? 0);
        setAvgRating(json.data?.avg ?? 0);

        if (prod?.categories?.length) fetchRelatedProducts(prod.categories[0].slug);
        if (user) fetchUserRating(prod.id);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoadingProduct(false);
      }
    };

    const fetchRelatedProducts = async (categorySlug) => {
      try {
        const res = await fetch(`${API_URL}/category/${categorySlug}/products`);
        const json = await res.json();
        setRelatedProducts(json.data?.filter(p => p.slug !== slug) || []);
      } catch (err) {
        console.error("Erro ao carregar produtos relacionados:", err);
      }
    };

    const fetchUserRating = async (productId) => {
      try {
        const res = await fetch(`${API_URL}/rating/user/${user.id}`, { credentials: "include" });
        if (!res.ok) return;

        const json = await res.json();
        const ratingsArray = Array.isArray(json) ? json : [];
        const ratingObj = ratingsArray.find(r => r.product.id === productId);
        if (ratingObj) setUserRating(ratingObj.evaluation);
      } catch (err) {
        console.error("Erro ao buscar avaliação do usuário:", err);
      }
    };

    fetchProduct();
  }, [slug, productImgUrl, user]);

  if (loadingProduct) return <p>Carregando produto...</p>;
  if (!product) return <p>Produto não encontrado</p>;

  const isFavorite = localFavorites.some(f => f.product?.id === product.id);

  const handleWishlist = async () => {
    if (!user) return navigate("/login", { state: { from: slug } });
    const added = await addOrRemoveFavorite(product);
    notify(added ? "❤ Produto adicionado aos favoritos" : "❌ Produto removido dos favoritos");
    setFavCount(prev => prev + (added ? 1 : -1));
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!user) return navigate("/login", { state: { from: slug } });

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(c => c.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    notify(`✅ ${product.name} adicionado ao carrinho!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    notify("🔗 Link do produto copiado!");
  };

  const handleRating = async (value) => {
    if (!user) {
      notify("Você precisa estar logado para avaliar!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          evaluation: Number(value)
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao avaliar produto");
      }

      setUserRating(value);

      // Atualiza média e total de avaliações
      const avgRes = await fetch(`${API_URL}/product/${slug}`, { credentials: "include" });
      const avgJson = await avgRes.json();
      setAvgRating(avgJson.data?.avg ?? 0);
      setRatingCount(avgJson.data?.totalRating ?? 0);

      notify(`⭐ Avaliação enviada com sucesso!`);
    } catch (err) {
      notify(err.message);
    }
  };

  return (
    <div className="product-page">
      {/* Imagem do Produto */}
      <div className="product-image">
        <img src={mainImg || "https://via.placeholder.com/400x400"} alt={product.name} />
        <div className="thumbnail-list">
          {(product.gallery?.length ? product.gallery : [mainImg]).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              onClick={() => setMainImg(img)}
              className={mainImg === img ? "active" : ""}
            />
          ))}
        </div>

        <div className="image-actions">
          <button
            className={`wishlist-icon ${isFavorite ? "active" : ""}`}
            onClick={handleWishlist}
            disabled={loadingToggle === product.id}
          >
            {loadingToggle === product.id ? "..." : <FaHeart />} {favCount}
          </button>
          <button className="share-icon" onClick={handleShare}>
            <FaShareAlt />
          </button>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="product-details">
        <h1>{product.name}</h1>

        <div className="rating">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <FaStar
                key={i}
                className={starValue <= (hoverRating || userRating) ? "star filled" : "star"}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(starValue)}
              />
            );
          })}
          <span>({ratingCount} avaliações, média {avgRating.toFixed(1)})</span>
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
                {mat.name}{i < product.materials.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}

        {/* Ações: quantidade + adicionar ao carrinho */}
        <div className="actions">
          <div className="quantity-control product-page-quantity">
            <button onClick={() => handleQuantityChange(-1)}><FaMinus /></button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={() => handleQuantityChange(1)}><FaPlus /></button>
          </div>

          <button className="buy-btn" onClick={handleAddToCart}>Fazer Orçamento</button>
        </div>

        {notification && <div className="notification">{notification}</div>}
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Produtos Relacionados</h2>
          <div className="related-list">
            {relatedProducts.slice(0, 4).map(p => (
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
