import React, { useState, useEffect } from "react";
import "./css/Config.css";
import { useUserContext } from "~/context/UserContext";
import { FaAdjust, FaBomb, FaCogs, FaEnvelope, FaExclamationTriangle, FaGrav, FaKey, FaPersonBooth, FaPrescriptionBottle, FaScrewdriver, FaSearchengin, FaVoicemail } from "react-icons/fa";

export default function Config() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: "",
    password: "",
    confirmDelete: "",
  });
  const { user } = useUserContext();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canDelete, setCanDelete] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("As senhas não coincidem.");
    }
    try {
      const res = await fetch(`${API_URL}/user/change-password`, {
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
        setFormData({ ...formData, oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(json.message || "Erro ao alterar senha.");
      }
    } catch {
      setError("Erro inesperado ao alterar senha.");
    }
  };

  // New function to handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/user/change-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          newEmail: formData.newEmail,
          password: formData.password,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage("E-mail alterado com sucesso!");
        setError(null);
        setFormData({ ...formData, newEmail: "", password: "" });
      } else {
        setError(json.message || "Erro ao alterar e-mail.");
      }
    } catch {
      setError("Erro inesperado ao alterar e-mail.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API_URL}/user/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Conta desativada com sucesso. Você será deslogado.");
        await fetch(`${API_URL}/logout`, { method: "POST" });
        window.location.href = "/";

      } else {
        const json = await res.json();
        setError(json.message || "Erro ao excluir conta.");
      }
    } catch {
      setError("Erro inesperado ao excluir conta.");
    }
    setShowDeleteModal(false);
    setCountdown(5); // Reset countdown
    setCanDelete(false);
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    let timer;
    if (showDeleteModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanDelete(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, showDeleteModal]);

  return (
    <div className="config-container">
      <h2><FaScrewdriver color="#ff5518" /> Configurações da Conta</h2>

      {message && <div className="alert success slide-in">{message}</div>}
      {error && <div className="alert error slide-in">{error}</div>}

      {/* Alterar Senha */}
      <form className="config-form" onSubmit={handlePasswordChange}>
        <h3><FaKey color="#ff5518" /> Alterar Senha</h3>
        <input type="password" placeholder="Senha Atual" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required />
        <input type="password" placeholder="Nova Senha" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
        <input type="password" placeholder="Confirmar Nova Senha" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit" className="btn-primary">Salvar Senha</button>
      </form>

      {/* Alterar Email */}
      <form className="config-form" onSubmit={handleEmailChange}>
        <h3><FaEnvelope color="#ff5518" /> Alterar E-mail</h3>
        <input type="email" placeholder="Novo E-mail" name="newEmail" value={formData.newEmail} onChange={handleChange} required />
        <input type="password" placeholder="Confirme com sua Senha Atual" name="password" value={formData.password} onChange={handleChange} required />
        <button type="submit" className="btn-primary">Salvar E-mail</button>
      </form>

      {/* Desativar Conta */}
      <div className="delete-section">
        <h3> <FaExclamationTriangle color="#ff5518" /> Desativar Conta</h3>
        <p>
          Sua conta será desativada e você não poderá mais acessar o sistema. Para reativá-la no futuro, entre em contato com o suporte.
        </p>
        <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
          Desativar Minha Conta
        </button>
      </div>

      {/* Modal de desativação */}
      {showDeleteModal && (
        <div className="modal-overlay fade-in">
          <div className="modal scale-in">
            <h3>Confirme a desativação</h3>
            <p>Digite <strong>DESATIVAR</strong> para confirmar.</p>
            <p>{!canDelete ? `Aguarde ${countdown}s antes de confirmar` : "Você pode confirmar agora"}</p>
            <input type="text" name="confirmDelete" value={formData.confirmDelete} onChange={handleChange} placeholder="DESATIVAR" disabled={!canDelete} />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn-danger" disabled={!canDelete || formData.confirmDelete !== "DESATIVAR"} onClick={handleDeleteAccount}>
                Confirmar Desativação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}