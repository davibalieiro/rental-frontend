import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
        : { name, email, phone, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      // Checar se status é sucesso
      if (response.status !== 201) {
        setError(data.message || "Erro na operação");
        return;
      }

      // Redirecionar baseado no tipo de usuário
      if (data.user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/home"); 
      }

    } catch (err) {
      setError("Erro ao conectar com servidor");
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "" : "active"}`}>
        <div className="auth-panel">
          <h2>{isLogin ? "Novo por aqui?" : "Já tem conta?"}</h2>
          <p>
            {isLogin
              ? "Crie uma conta e entre na comunidade!"
              : "Entre na sua conta para continuar."}
          </p>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Registrar" : "Login"}
          </button>
        </div>

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <h2>{isLogin ? "Login" : "Registrar"}</h2>
            {error && <p className="error">{error}</p>}

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </>
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
