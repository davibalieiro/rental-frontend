import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductImages } from "~/hooks/useProductImages";
import { useProducts } from "~/hooks/useProducts";

import "./css/CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const { products } = useProducts();
  const { imageUrls } = useProductImages(products);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
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
    updateCart([], "Carrinho limpo com sucesso.");
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if ((updatedCart[index].quantity || 1) > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cart];
    const newValue = parseInt(value, 10);
    updatedCart[index].quantity = isNaN(newValue) || newValue < 1 ? 1 : newValue;
    updateCart(updatedCart);
  };

  const handleConfirmOrder = () => {
    navigate("/orcamento");
  };

  return (
    <div>
      {/* TITULO EM CIMA DE TUDO */}
      <h1 className="page-title">Finalizar Pedido</h1>

      <div className="cart-page">
        {/* COLUNA ESQUERDA - Detalhe do Pedido + Resumo */}
        <div className="cart-left">
          <div className="card">
            <h2>Detalhe do Pedido</h2>
            {message && <p className="feedback-msg">{message}</p>}
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                      <img src={imageUrls[item.id]} alt={item.name} />
                      <div className="cart-info">
                        <h4>{item.name}</h4>
                        <p>{item.short_description}</p>
                        {/* QUANTIDADE */}
                        <div className="quantity-control">
                          <button onClick={() => decreaseQuantity(index)}>
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity || 1}
                            min="1"
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                          />
                          <button onClick={() => increaseQuantity(index)}>
                            +
                          </button>
                        </div>
                        {/* BOTÃO VER PRODUTO */}
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
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Limpar Carrinho
                </button>
              </>
            )}
          </div>

          {/* Resumo da Locação agora embaixo do Detalhe do Pedido */}
          <div className="card">
            <h2>Resumo da Locação</h2>
            <p>Confira os itens e prossiga para confirmar o pedido.</p>

            <textarea
              placeholder="Observações (ex: horário de retirada, local de entrega, necessidades especiais...)"
              className="cart-notes"
            />

            <button
              className="checkout-btn"
              onClick={handleConfirmOrder}
              disabled={cart.length === 0}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA - Detalhes do Evento */}
        <div className="cart-right">
          <div className="card form-card">
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
