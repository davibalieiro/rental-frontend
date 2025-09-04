import React, { useState } from "react";
import "./Config.css";

export default function Config() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: "",
    passwordForEmail: "",
    notifications: "email",
    recoveryEmail: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Alterar senha
  async function handlePasswordChange(e) {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("As senhas não coincidem.");
    }
    try {
      const res = await fetch("http://localhost:3000/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage("Senha alterada com sucesso!");
        setError(null);
      } else {
        setError(json.message || "Erro ao alterar senha.");
      }
    } catch {
      setError("Erro inesperado ao alterar senha.");
    }
  }

  // Alterar email
  async function handleEmailChange(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/user/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          newEmail: formData.newEmail,
          password: formData.passwordForEmail,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage("Email alterado com sucesso!");
        setError(null);
      } else {
        setError(json.message || "Erro ao alterar email.");
      }
    } catch {
      setError("Erro inesperado ao alterar email.");
    }
  }

  // Notificações
  const handleNotifications = (e) => {
    e.preventDefault();
    setMessage(`Preferência de notificação salva: ${formData.notifications}`);
    setError(null);
  };

  // Recuperar senha
  async function handlePasswordRecovery(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.recoveryEmail }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage("Enviamos um email de recuperação de senha!");
        setError(null);
      } else {
        setError(json.message || "Erro ao solicitar recuperação.");
      }
    } catch {
      setError("Erro inesperado ao solicitar recuperação.");
    }
  }

  // Excluir conta
  async function handleDeleteAccount() {
    try {
      const res = await fetch("http://localhost:3000/api/user/delete", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("Conta excluída com sucesso. Você será deslogado.");
        window.location.href = "/"; // redireciona
      } else {
        const json = await res.json();
        setError(json.message || "Erro ao excluir conta.");
      }
    } catch {
      setError("Erro inesperado ao excluir conta.");
    }
    setShowDeleteModal(false);
  }

  return (
    <div className="config-container">
      <h3>⚙️ Configurações da Conta</h3>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      {/* Alterar Senha */}
      <form className="config-form" onSubmit={handlePasswordChange}>
        <h4>🔑 Alterar Senha</h4>
        <label>Senha Atual</label>
        <input
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
        />
        <label>Nova Senha</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
        />
        <label>Confirmar Nova Senha</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Salvar Senha</button>
      </form>

      {/* Alterar Email */}
      <form className="config-form" onSubmit={handleEmailChange}>
        <h4>📧 Alterar Email</h4>
        <label>Novo Email</label>
        <input
          type="email"
          name="newEmail"
          value={formData.newEmail}
          onChange={handleChange}
        />
        <label>Senha Atual</label>
        <input
          type="password"
          name="passwordForEmail"
          value={formData.passwordForEmail}
          onChange={handleChange}
        />
        <button type="submit">Salvar Email</button>
      </form>

      {/* Notificações */}
      <form className="config-form" onSubmit={handleNotifications}>
        <h4>🔔 Notificações</h4>
        <label>Receber notificações por:</label>
        <select
          name="notifications"
          value={formData.notifications}
          onChange={handleChange}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
        <button type="submit">Salvar Preferência</button>
      </form>

      {/* Recuperar Senha */}
      <form className="config-form" onSubmit={handlePasswordRecovery}>
        <h4>🛠️ Recuperar Senha</h4>
        <label>Email para recuperação</label>
        <input
          type="email"
          name="recoveryEmail"
          value={formData.recoveryEmail}
          onChange={handleChange}
        />
        <button type="submit">Enviar Link de Recuperação</button>
      </form>

      {/* Excluir Conta */}
      <div className="delete-section">
        <h4>⚠️ Excluir Conta</h4>
        <p>
          Essa ação é irreversível. Todos os seus dados serão apagados
          permanentemente.
        </p>
        <button
          className="btn-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Excluir Minha Conta
        </button>
      </div>

      {/* Modal de confirmação */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Tem certeza que deseja excluir sua conta?</h4>
            <p>Essa ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleDeleteAccount}>
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
