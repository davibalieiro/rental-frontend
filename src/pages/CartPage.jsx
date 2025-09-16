import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductImages } from "~/hooks/useProductImages";
import { useProducts } from "~/hooks/useProducts";
import { FaPlus, FaMinus, FaTrashAlt, FaSpinner } from "react-icons/fa";
import "./css/CartPage.css";
import { useUserContext } from "~/context/UserContext";

export default function CartPage() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const { user, loading } = useUserContext();

  const navigate = useNavigate();

const { products } = useProducts();
  const {imageUrls } = useProductImages(products);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const savedNotes = localStorage.getItem("cartNotes") || "";
    setNotes(savedNotes);
  }, []);

  const updateCart = (newCart, msg = "") => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    if (msg) {
      setMessage(msg);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart, "Item removido do carrinho.");
  };

  const clearCart = () => {
    setShowClearConfirm(false);
    updateCart([], "Carrinho limpo com sucesso.");
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    updateCart(updatedCart, "Quantidade atualizada");
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if ((updatedCart[index].quantity || 1) > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart, "Quantidade atualizada");
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cart];
    const newValue = parseInt(value, 10);
    updatedCart[index].quantity = isNaN(newValue) || newValue < 1 ? 1 : newValue;
    updateCart(updatedCart, "Quantidade atualizada");
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem("cartNotes", e.target.value);
  };

  const handleConfirmOrder = () => {
    navigate("/concluir-pedido");
  };

  const suggestedProducts = products
    .filter((p) => !cart.find((c) => c.id === p.id))
    .slice(0, 4);

  // ========================
  // CUPOM
  // ========================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const res = await fetch(`${API_URL}/coupons/code/${couponCode}`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      const couponData = data?.data;
      if (!couponData) {
        setCouponMessage(data?.error || "Cupom inválido ou não encontrado.");

        setAppliedCoupon(null);
        return;
      }
      const allowedUsers = Array.isArray(couponData?.allowedUsers) ? couponData.allowedUsers : [];
      const usersThatUsedCoupon = Array.isArray(couponData?.usersThatUsedCoupon) ? couponData.usersThatUsedCoupon : [];
      console.log(allowedUsers);
      console.log(res);

      if (!res.ok ||
        (!couponData.isPublic && !allowedUsers.some(u => u.id === user.id))
        || !couponData.isActive) {
        setCouponMessage(data?.error || "Cupom inválido ou não encontrado.");
        setAppliedCoupon(null);
        return;
      }
      if (usersThatUsedCoupon.some(u => u.id === user.id)) {
        setCouponMessage("Você já usou esse cupom.");
        setAppliedCoupon(null);
        return;
      }

      const coupon = data.data;

      if (!coupon.isActive) {
        setCouponMessage("Este cupom está inativo.");
        setAppliedCoupon(null);
        return;
      }
      if (new Date(coupon.expiresIn) < new Date()) {
        setCouponMessage("Este cupom expirou.");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(coupon);
      // GUARDA ESSE CUPOM EM ALGUM CANTO, SÓ VAI VALIDAR (/use/couponId) QUANDO CONFIRMAR A COMPRA
      localStorage.setItem('coupon', JSON.stringify(coupon));

    } catch (err) {
      console.error("Erro ao aplicar cupom:", err);
      setCouponMessage("Erro ao validar cupom.");
      setAppliedCoupon(null);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Finalizar Pedido</h1>

      <div className="cart-content">
        <div className="cart-items">
          <div className="card">
            <h2>Detalhe do Pedido</h2>
            {message && <p className="feedback-msg">{message}</p>}
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img
                      src={imageUrls[item.id]}
                      alt={item.name}
                      onClick={() => navigate(`/produto/${item.slug}`)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className="cart-details">
                      <h4>{item.name}</h4>
                      <p>{item.short_description}</p>

                      <div className="quantity-control">
                        <button onClick={() => decreaseQuantity(index)}>
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          value={item.quantity || 1}
                          min="1"
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                        <button onClick={() => increaseQuantity(index)}>
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        className="view-product-btn"
                        onClick={() => navigate(`/produto/${item.slug}`)}
                      >
                        Ver Produto
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}

                <button
                  className="clear-cart-btn"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Limpar Carrinho
                </button>

                {showClearConfirm && (
                  <div className="modal-confirm">
                    <p>Tem certeza que deseja limpar o carrinho?</p>
                    <button onClick={clearCart}>Sim</button>
                    <button onClick={() => setShowClearConfirm(false)}>Não</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* CUPOM */}
          <div className="card">
            <h2>Cupom de Desconto</h2>
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Digite seu cupom"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Aplicar</button>
            </div>
            {couponMessage && <p className="feedback-msg">{couponMessage}</p>}
            {appliedCoupon && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                Cupom aplicado: {appliedCoupon.text} ({appliedCoupon.benefit})
              </p>
            )}
          </div>

          <div className="card">
            <h2>Resumo da Locação</h2>
            <textarea
              placeholder="Observações..."
              className="cart-notes"
              value={notes}
              onChange={handleNotesChange}
            />
            <button
              className="checkout-btn"
              onClick={handleConfirmOrder}
              disabled={cart.length === 0}
            >
              Confirmar Pedido
            </button>
          </div>

          {suggestedProducts.length > 0 && (
            <div className="card">
              <h2>Você pode gostar</h2>
              <div className="suggestion-list">
                {suggestedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="suggestion-item"
                    onClick={() => navigate(`/produto/${p.slug}`)}
                  >
                    <img src={imageUrls[p.id]} alt={p.name} />
                    <p>{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="cart-form">
          <div className="card">
            <h2>Detalhes do Evento</h2>
            <form className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Data do Evento</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Horário do Evento</label>
                  <input type="time" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Local do Evento</label>
                  <input type="text" required placeholder="Digite o local" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
