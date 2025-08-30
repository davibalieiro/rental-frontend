import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRequestQuote = () => {
    navigate("/orcamento");
  };

  return (
    <div>
      {/* TITULO EM CIMA DE TUDO */}
      <h1 className="page-title">Finalizar Pedido</h1>

      <div className="cart-page">
        {/* FORMULÁRIO DE INFORMAÇÕES */}
        <div className="card form-card">
          <h2>Preencha suas informações abaixo:</h2>
          <form className="checkout-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input type="text" required placeholder="Digite seu nome" />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" required placeholder="Digite seu e-mail" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Telefone</label>
                <input type="tel" required placeholder="(xx) xxxxx-xxxx" />
              </div>
              <div className="form-group">
                <label>Data do Evento</label>
                <input type="date" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Local do Evento</label>
                <input type="text" required placeholder="Digite o local" />
              </div>
              <div className="form-group">
                <label>Como nos conheceu?</label>
                <select required>
                  <option value="">Selecione</option>
                  <option value="google">Google</option>
                  <option value="indicacao">Indicação</option>
                  <option value="instagram">Instagram</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* COLUNAS DO CARRINHO */}
        <div className="cart-columns">
          {/* AGORA O DETALHE DO PEDIDO VEM NA ESQUERDA */}
          <div className="cart-left">
            <div className="card">
              <h2>Detalhe do Pedido</h2>
              {cart.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
              ) : (
                <ul className="cart-list">
                  {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                      <img
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.name}
                      />
                      <div className="cart-info">
                        <h4>{item.name}</h4>
                        <p>{item.short_description}</p>
                        {/* NOVO: Mostrar quantidade pedida */}
                        <p><strong>Quantidade:</strong> {item.selectedQuantity || 1}</p>


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

              )}
            </div>
          </div>

          {/* E O RESUMO DA LOCAÇÃO VAI PRA DIREITA */}
          <div className="cart-right">
            <div className="card">
              <h2>Resumo da Locação</h2>
              <p>Confira os itens e prossiga para solicitar o orçamento.</p>

              <textarea
                placeholder="Observações (ex: horário de retirada, local de entrega, necessidades especiais...)"
                className="cart-notes"
              />

              <button
                className="checkout-btn"
                onClick={handleRequestQuote}
                disabled={cart.length === 0}
              >
                Solicitar Orçamento
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
