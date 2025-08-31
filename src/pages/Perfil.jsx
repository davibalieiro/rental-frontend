import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./css/Perfil.css";

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const [favorites, setFavorites] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    address: "",
    preferences: "",
    status: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "",
        address: user.address || "",
        preferences: user.preferences || "",
        status: user.status || "Novo Usuário",
      });
    }

    // Carrega favoritos do localStorage
    const savedFav = JSON.parse(localStorage.getItem("wishlist")) || [];
    setFavorites(savedFav);

    // Simula reservas (pode substituir por fetch real)
    setReservas([
      {
        id: 1,
        produto: "Cadeira Gamer",
        status: "Confirmada",
        data: "2025-08-31",
        slug: "cadeira-gamer",
      },
      {
        id: 2,
        produto: "Mesa de Escritório",
        status: "Pendente",
        data: "2025-09-03",
        slug: "mesa-escritorio",
      },
    ]);
  }, [loading, user, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Dados atualizados!");
    // Aqui você pode fazer um fetch para salvar as alterações no backend
  };

  return (
    <div className="perfil-container">
      <div className="perfil-sidebar">
        <div className="perfil-avatar">
          <img src="/assets/avatar_placeholder.png" alt="Avatar" />
        </div>
        <h2>{user?.name}</h2>
        <div className="perfil-tabs">
          <button className={activeTab==="perfil" ? "active" : ""} onClick={() => setActiveTab("perfil")}>Perfil</button>
          <button className={activeTab==="reservas" ? "active" : ""} onClick={() => setActiveTab("reservas")}>Minhas Reservas</button>
          <button className={activeTab==="favoritos" ? "active" : ""} onClick={() => setActiveTab("favoritos")}>Favoritos</button>
          <button className={activeTab==="config" ? "active" : ""} onClick={() => setActiveTab("config")}>Configurações</button>
        </div>
      </div>

      <div className="perfil-content">
        {/* Perfil */}
        {activeTab==="perfil" && (
          <>
            <h3>Informações do Usuário</h3>
            <form className="perfil-form" onSubmit={handleFormSubmit}>
              <div className="avatar-section">
                <img src="/assets/avatar_placeholder.png" alt="Avatar" />
                <input type="file" name="avatar" onChange={(e)=>console.log(e.target.files[0])} />
              </div>

              <label>Nome Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} />

              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} />

              <label>Telefone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} />

              <label>Data de Nascimento</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleFormChange} />

              <label>Gênero</label>
              <select name="gender" value={formData.gender} onChange={handleFormChange}>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>

              <label>Endereço</label>
              <input type="text" name="address" value={formData.address} onChange={handleFormChange} />

              <label>Preferências</label>
              <input type="text" name="preferences" value={formData.preferences} onChange={handleFormChange} placeholder="Ex: Apartamentos, SUVs" />

              <label>Status</label>
              <input type="text" name="status" value={formData.status} readOnly />

              <button type="submit">Salvar Alterações</button>
            </form>
          </>
        )}

        {/* Reservas */}
        {activeTab==="reservas" && (
          <>
            <h3>Minhas Reservas</h3>
            <div className="cards-container">
              {reservas.map(r => (
                <div className="card" key={r.id}>
                  <h4>{r.produto}</h4>
                  <p>Status: {r.status}</p>
                  <p>Data: {r.data}</p>
                  <button onClick={() => navigate(`/produto/${r.slug}`)}>Ver detalhes</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Favoritos */}
        {activeTab==="favoritos" && (
          <>
            <h3>Favoritos</h3>
            {favorites.length === 0 && <p>Nenhum produto favoritado.</p>}
            <div className="cards-container">
              {favorites.map(f => (
                <div className="card" key={f.slug}>
                  <img src={f.image || "https://via.placeholder.com/200"} alt={f.name} />
                  <h4>{f.name}</h4>
                  <p>{f.short_description}</p>
                  <button onClick={() => navigate(`/produto/${f.slug}`)}>Ver Produto</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Configurações */}
        {activeTab==="config" && (
          <>
            <h3>Configurações</h3>
            <form className="perfil-form" onSubmit={handleFormSubmit}>
              <label>Nova Senha</label>
              <input type="password" name="password" placeholder="Digite se quiser alterar" />

              <label>Notificações</label>
              <select name="notifications" onChange={handleFormChange}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
              </select>

              <button type="submit">Salvar Alterações</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
