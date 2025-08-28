import React, { useState } from "react";
import "./css/Login.css";
import { useNavigate } from "react-router";

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

      const body = isLogin ? { email, password } : { name, email, password };

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
        navigate("/admin");
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
    <div className={`container ${isLogin ? "" : "sign-up-mode"}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* LOGIN */}
          <form onSubmit={handleSubmit} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn solid">Login</button>
          </form>

          {/* CADASTRO */}
          <form onSubmit={handleSubmit} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">Cadastrar</button>
          </form>
        </div>
      </div>

      {/* Painéis laterais */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Enter your personal details and start your journey with us</p>
            <button
              className="btn transparent"
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>To keep connected with us please login with your personal info</p>
            <button
              className="btn transparent"
              onClick={() => setIsLogin(true)}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
