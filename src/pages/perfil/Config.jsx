import React, { useState, useEffect } from "react";
import "./Config.css";

export default function Config() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    confirmDelete: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canDelete, setCanDelete] = useState(false);
  const [language, setLanguage] = useState("pt");
  const [timeFormat, setTimeFormat] = useState("24h");

  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome - Windows", location: "São Paulo, BR", ip: "192.168.0.12", lastActive: "Hoje, 14:32" },
    { id: 2, device: "Firefox - Linux", location: "Rio de Janeiro, BR", ip: "192.168.0.33", lastActive: "Ontem, 19:10" },
  ]);

  const [history, setHistory] = useState([
    "Senha alterada em 01/09/2025",
    "Exportou dados da conta em 02/09/2025",
    "Sessão desconectada em 03/09/2025",
  ]);

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
        setFormData({ ...formData, oldPassword: "", newPassword: "", confirmPassword: "" });
        setHistory(prev => [`Senha alterada em ${new Date().toLocaleString()}`, ...prev]);
      } else {
        setError(json.message || "Erro ao alterar senha.");
      }
    } catch {
      setError("Erro inesperado ao alterar senha.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/delete", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("Conta excluída com sucesso. Você será deslogado.");
        window.location.href = "/";
      } else {
        const json = await res.json();
        setError(json.message || "Erro ao excluir conta.");
      }
    } catch {
      setError("Erro inesperado ao excluir conta.");
    }
    setShowDeleteModal(false);
    setCountdown(5);
    setCanDelete(false);
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => { setMessage(null); setError(null); }, 4000);
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

  const handleExportData = () => {
    const data = JSON.stringify({ sessions, history, language, timeFormat }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_data.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Dados exportados com sucesso!");
  };

  return (
    <div className="config-container">
      <h2>⚙️ Configurações da Conta</h2>

      {message && <div className="alert success slide-in">{message}</div>}
      {error && <div className="alert error slide-in">{error}</div>}

      {/* Alterar Senha */}
      <form className="config-form" onSubmit={handlePasswordChange}>
        <h3>🔑 Alterar Senha</h3>
        <input type="password" placeholder="Senha Atual" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required />
        <input type="password" placeholder="Nova Senha" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
        <input type="password" placeholder="Confirmar Nova Senha" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit" className="btn-primary">Salvar Senha</button>
      </form>

      {/* Sessões Ativas */}
      <div className="sessions-section">
        <h3>💻 Sessões Ativas</h3>
        <ul>
          {sessions.map(s => (
            <li key={s.id}>{s.device} | {s.location} | IP: {s.ip} | {s.lastActive}</li>
          ))}
        </ul>
        <button className="btn-primary" onClick={() => setMessage("Sessões desconectadas (simulado)!")}>Desconectar Todas</button>
      </div>

      {/* Histórico */}
      <div className="history-section">
        <h3>📜 Histórico de Atividades</h3>
        <ul>
          {history.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>

      {/* Configurações adicionais */}
      <div className="preferences-section">
        <h3>⚙️ Preferências</h3>
        <label>Idioma:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="pt">Português</option>
          <option value="en">English</option>
        </select>
        <label>Formato de Hora:</label>
        <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
          <option value="24h">24h</option>
          <option value="12h">12h</option>
        </select>
      </div>

      {/* Exportar Dados */}
      <div className="export-section">
        <h3>📁 Exportar Dados</h3>
        <button className="btn-primary" onClick={handleExportData}>Exportar JSON</button>
      </div>

      {/* Excluir Conta */}
      <div className="delete-section">
        <h3>⚠️ Excluir Conta</h3>
        <p>Esta ação é irreversível. Todos os dados serão apagados permanentemente.</p>
        <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>Excluir Minha Conta</button>
      </div>

      {/* Modal de exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay fade-in">
          <div className="modal scale-in">
            <h3>Confirme a exclusão</h3>
            <p>Digite <strong>DELETE</strong> para confirmar.</p>
            <p>{!canDelete ? `Aguarde ${countdown}s antes de confirmar` : "Você pode confirmar agora"}</p>
            <input type="text" name="confirmDelete" value={formData.confirmDelete} onChange={handleChange} placeholder="DELETE" disabled={!canDelete} />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn-danger" disabled={!canDelete} onClick={() => {
                if(formData.confirmDelete === "DELETE") handleDeleteAccount();
                else setError("Digite DELETE para confirmar");
              }}>Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
