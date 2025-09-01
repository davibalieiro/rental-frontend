import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"; // Seu CSS

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const url = isLogin
        ? "http://localhost:3000/api/login"
        : "http://localhost:3000/api/register";

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

      if (response.status !== 201) {
        setError(data.message || "Erro na operação");
        return;
      }

      if (isLogin) {
        navigate("/");
      } else {
        setSuccessMessage("Conta criada com sucesso! Agora faça login.");
        setIsLogin(true);
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Erro ao conectar com servidor");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Registrar"}</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="btn-submit">
            {isLogin ? "Entrar" : "Registrar"}
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