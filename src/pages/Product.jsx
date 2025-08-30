import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./css/Products.css";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // 🔹 Novo estado

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

    // 🔹 Adiciona quantidade ao carrinho
    cart.push({
      ...product,
      selectedQuantity,
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    setNotification(`✅ ${selectedQuantity}x ${product.name} adicionado ao carrinho!`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
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
      {/* Galeria */}
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
        <p className="short-description">{product.short_description}</p>
        <p className="long-description">{product.long_description}</p>

        <p><strong>Estoque:</strong> {product.quantity} unidades</p>
        <p><strong>Dimensão:</strong> {product.dimension}</p>
        <p><i>Montagem {product.is_included_montage ? 'inclusa' : 'Não inclusa'}</i></p>

        {/* 🔹 Campo de quantidade */}
        <div className="quantity-field">
          <label>Quantidade: </label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={selectedQuantity}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val > product.quantity) val = product.quantity;
              if (val < 1) val = 1;
              setSelectedQuantity(val);
            }}
          />
        </div>

        {/* Categorias */}
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

        {/* Materiais */}
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

        {/* Botões */}
        <div className="actions">
          <button className="buy-btn" onClick={handleAddToCart}>
            Fazer Orçamento
          </button>
        </div>

        {/* Notificação */}
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}
