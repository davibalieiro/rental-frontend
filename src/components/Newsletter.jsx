// src/components/Newsletter.jsx
import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // success | error | loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await response.json();
        setStatus(data.message || "error");
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setStatus("error");
    }
  };

  return (
    <section className="newsletter">
      <h3>Assine Nossa Newsletter</h3>
      <p>Receba novidades, ofertas e inspirações para seus eventos.</p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Enviando..." : "Cadastrar"}
        </button>
      </form>

      {status === "success" && (
        <p className="success-msg">✅ Email cadastrado com sucesso!</p>
      )}
      {status && status !== "success" && status !== "loading" && (
        <p className="error-msg">❌ {status}</p>
      )}
    </section>
  );
}
