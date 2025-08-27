import React, { useEffect, useState } from "react";

export default function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/me", {
      credentials: "include", // envia cookie HttpOnly
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não autenticado");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return null; // não mostra nada se não estiver logado
  }

  return (
    <div className="user-info">
      <p>
        Bem-vindo, <strong>{user.name}</strong> 👋
      </p>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <p>
        {user.is_admin ? "Você é administrador ✅" : "Usuário comum"}
      </p>
    </div>
  );
}
