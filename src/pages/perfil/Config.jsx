import React, { useState } from "react";
import "./Config.css";

export default function Config() {
  const [formData, setFormData] = useState({
    password: "",
    notifications: "email",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Configurações salvas com sucesso!");
    // Aqui você faria o fetch para salvar no backend
  };

  return (
    <div className="config-container">
      <h3>Configurações</h3>
      <form className="config-form" onSubmit={handleFormSubmit}>
        <label>Nova Senha</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Digite se quiser alterar"
          onChange={handleFormChange}
        />

        <label>Notificações</label>
        <select
          name="notifications"
          value={formData.notifications}
          onChange={handleFormChange}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}
