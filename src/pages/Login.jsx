import { useState } from "react";

export default function Login({ navigate }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    // Exemplo simples: login admin ou cliente
    if (email === "admin@clisare.com" && senha === "1234") {
      navigate("admin"); // vai para o painel admin
    } else if (email === "cliente@clisare.com" && senha === "1234") {
      navigate("catalogo"); // vai para catálogo
    } else {
      alert("Credenciais inválidas!");
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
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
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}