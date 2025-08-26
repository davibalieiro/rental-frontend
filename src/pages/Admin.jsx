import React, { useState } from "react";

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Clisare Admin</h2>
        <ul>
          <li onClick={() => setActiveSection("dashboard")}>📊 Dashboard</li>
          <li onClick={() => setActiveSection("catalogo")}>📦 Catálogo</li>
          <li onClick={() => setActiveSection("empresa")}>🏢 Empresa</li>
          <li onClick={() => setActiveSection("usuarios")}>👥 Usuários</li>
          <li onClick={() => setActiveSection("config")}>⚙️ Configurações</li>
        </ul>
      </aside>

      {/* Conteúdo dinâmico */}
      <main className="admin-content">
        {activeSection === "dashboard" && (
          <section>
            <h1>Dashboard</h1>
            <p>Bem-vindo ao painel administrativo.</p>
          </section>
        )}

        {activeSection === "catalogo" && (
          <section>
            <h1>Gerenciar Catálogo</h1>
            <form className="form">
              <input type="text" placeholder="Nome do item" />
              <input type="number" placeholder="Preço de locação" />
              <textarea placeholder="Descrição"></textarea>
              <button>Adicionar Item</button>
            </form>
          </section>
        )}

        {activeSection === "empresa" && (
          <section>
            <h1>Dados da Empresa</h1>
            <form className="form">
              <input type="text" placeholder="Nome da empresa" />
              <input type="text" placeholder="Endereço" />
              <input type="text" placeholder="Telefone" />
              <button>Salvar</button>
            </form>
          </section>
        )}

        {activeSection === "usuarios" && (
          <section>
            <h1>Gerenciar Usuários</h1>
            <ul className="user-list">
              <li>João Silva - Cliente</li>
              <li>Maria Souza - Cliente</li>
              <li>Pedro Admin - Administrador</li>
            </ul>
          </section>
        )}

        {activeSection === "config" && (
          <section>
            <h1>Configurações</h1>
            <p>Aqui o administrador pode ajustar preferências do sistema.</p>
          </section>
        )}
      </main>
    </div>
  );
}
