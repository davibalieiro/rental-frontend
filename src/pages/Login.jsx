import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // corrigi para router-dom
import "./css/Login.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isLogin
        ? "http://localhost:3000/api/login"
        : "http://localhost:3000/api/register";

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro na operação");
        return;
      }

      if (isLogin) {
        navigate("/admin"); // redireciona se login OK
      } else {
        alert("Cadastro realizado com sucesso! Faça login.");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Erro ao conectar com servidor");
    }
  };
  
return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "" : "active"}`}>
        {/* Painel lateral */}
        <div className="auth-panel">
          <h2>{isLogin ? "Novo por aqui?" : "Já tem conta?"}</h2>
          <p>{isLogin ? "Crie uma conta e entre na comunidade!" : "Entre na sua conta para continuar."}</p>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Registrar" : "Login"}
          </button>
        </div>

        {/* Área do formulário */}
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <h2>{isLogin ? "Login" : "Registrar"}</h2>
            {error && <p className="error">{error}</p>}

            {!isLogin && (
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">{isLogin ? "Entrar" : "Registrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
