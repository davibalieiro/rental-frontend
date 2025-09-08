import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

// Modal de sucesso com um console.log para depuração
function SuccessModal({ message }) {
  // LOG 2: Este log nos dirá se o componente do modal está sendo renderizado
  console.log("Renderizando SuccessModal com a mensagem:", message);

  if (!message) return null;

  return (
    <div className="success-modal">
      {message}
    </div>
  );
}

export default function Auth() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginSuccessModal, setLoginSuccessModal] = useState("");
  const navigate = useNavigate();

  // NOVO: Estado para controlar o carregamento e desabilitar o botão
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const url = isLogin
        ? `${API_URL}/login`
        : `${API_URL}/register`;

      const body = isLogin
        ? { email, password }
        : { name, email, phone, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro na operação");
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        console.log("SUCESSO NO LOGIN! Ativando o modal...");

        setLoginSuccessModal("Login bem-sucedido! Redirecionando...");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);

      } else {
        setSuccessMessage("Conta criada com sucesso! Agora faça login.");
        setIsLoading(false);
        setIsLogin(true);
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Erro ao conectar com servidor");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <SuccessModal message={loginSuccessModal} />

      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Registrar"}</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* ... campos do formulário ... */}
          <div className={`register-fields ${!isLogin ? "visible" : ""}`}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              placeholder="(xx) xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={!isLogin}
            />
          </div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Botão agora usa o estado isLoading */}
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Aguarde..." : (isLogin ? "Entrar" : "Registrar")}
          </button>
        </form>

        <div className="toggle-auth">
          {isLogin ? (
            <>
              Não tem uma conta?{" "}
              <button
                type="button"
                className="btn-toggle"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccessMessage("");
                }}
              >
                Registre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                type="button"
                className="btn-toggle"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccessMessage("");
                }}
              >
                Faça login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}