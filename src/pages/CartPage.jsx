// CartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductImages } from "~/hooks/useProductImages";
import { useProducts } from "~/hooks/useProducts";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import "./css/CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const { products } = useProducts();
  const { imageUrls } = useProductImages(products);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

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
    navigate("/orcamento");
  };

  const suggestedProducts = products
    .filter((p) => !cart.find((c) => c.id === p.id))
    .slice(0, 4);

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

          {/* Sugestões de produtos */}
          {suggestedProducts.length > 0 && (
            <div className="card">
              <h2>Você pode gostar</h2>
              <div className="suggestion-list">
                {suggestedProducts.map((p) => (
                  <div key={p.id} className="suggestion-item" onClick={() => navigate(`/produto/${p.slug}`)}>
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
