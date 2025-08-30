import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./css/Products.css";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/product/${slug}`, {
          credentials: "include",
        });
        const json = await res.json();
        setProduct(json.data);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  if (loading) return <p>Carregando produto...</p>;
  if (!product) return <p>Produto não encontrado</p>;

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cartpage");
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

  const isFavorite = wishlist.some((item) => item.slug === product.slug);

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt; 
        <Link to={`/categoria/${product.category?.slug}`}>
          {product.category?.name}
        </Link> &gt; 
        <span>{product.name}</span>
      </nav>

      {/* Galeria de imagens */}
      <div className="product-image">
        <img
          src={product.image || "https://via.placeholder.com/400x400"}
          alt={product.name}
        />
        <div className="thumbnail-list">
          {(product.gallery || [product.image]).map((img, i) => (
            <img key={i} src={img} alt={`thumb-${i}`} />
          ))}
        </div>
      </div>

      {/* Detalhes */}
      <div className="product-details">
        <h1>{product.name}</h1>

        {/* Avaliações */}
        <div className="rating">
          ⭐⭐⭐⭐☆ <span>(23 avaliações)</span>
        </div>

        <p className="short-description">{product.short_description}</p>
        <p className="long-description">{product.long_description}</p>

        <p><strong>Estoque:</strong> {product.quantity} unidades</p>
        <p><strong>Dimensão:</strong> {product.dimension}</p>

        {/* Botões */}
        <div className="actions">
          <button className="buy-btn" onClick={handleAddToCart}>
            Fazer Orçamento
          </button>
          <button
            className={`wishlist-btn ${isFavorite ? "active" : ""}`}
            onClick={handleWishlist}
          >
            {isFavorite ? "❤️ Favorito" : "🤍 Adicionar aos Favoritos"}
          </button>
        </div>

        {/* Compartilhar */}
        <div className="share">
          <span>Compartilhar:</span>
          <a href={`https://wa.me/?text=Olha este produto: ${window.location.href}`} target="_blank" rel="noreferrer">WhatsApp</a> | 
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer">Facebook</a> | 
          <a href={`https://www.instagram.com/?url=${window.location.href}`} target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
    </div>
  );
}
