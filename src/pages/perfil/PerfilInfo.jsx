import React from "react";

export default function PerfilInfo({ user, favorites = [] }) {
  return (
    <div className="perfil-info-card">
      <h3>Informações do Usuário</h3>
      <div className="perfil-info">
        <p><strong>Nome:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Telefone:</strong> {user?.phone || "Não informado"}</p>
        <p><strong>Status:</strong> {user?.status || "Novo Usuário"}</p>
        <p><strong>Data de Cadastro:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "Não disponível"}</p>
        <p><strong>Favoritos Salvos:</strong> {favorites.length}</p>
      </div>
    </div>
  );
}
