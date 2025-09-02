// src/components/admin/Products.jsx
import React, { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import '../css/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    long_description: "",
    dimension: "",
    is_included_montage: false,
    categoryIds: [],
    materialIds: []
  });
  const [imageFile, setImageFile] = useState(null);

  // Buscar produtos
  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/product/all", {
        credentials: 'include'
      });
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  // Buscar categories e materials
  useEffect(() => {
    async function fetchOptions() {
      try {
        const catRes = await fetch("http://localhost:3000/api/category/all");
        const matRes = await fetch("http://localhost:3000/api/material/all");
        const catData = await catRes.json();
        const matData = await matRes.json();
        setCategories(catData.data || []);
        setMaterials(matData.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOptions();
    fetchProducts();
  }, []);

  // Submit do formulário
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // 1️⃣ Criar produto
      const res = await fetch("http://localhost:3000/api/product", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      const productId = json.data.id;

      // 2️⃣ Upload de imagem (se houver)
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        await fetch(`http://localhost:3000/api/upload-image/${productId}`, {
          method: "POST",
          body: formData,
          credentials: 'include'
        });
      }

      // Reset formulário
      setForm({
        name: "",
        short_description: "",
        long_description: "",
        dimension: "",
        is_included_montage: false,
        categoryIds: [],
        materialIds: []
      });
      setImageFile(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  // Atualiza seleção de múltiplos itens
  function handleMultiSelect(e, field) {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setForm({ ...form, [field]: options });
  }

  return (
    <div className="products-page">
      <h2>Gerenciar Produtos</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Short description"
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Long description"
          value={form.long_description}
          onChange={(e) => setForm({ ...form, long_description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Dimension (ex: 120x60x60)"
          value={form.dimension}
          onChange={(e) => setForm({ ...form, dimension: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={form.is_included_montage}
            onChange={(e) => setForm({ ...form, is_included_montage: e.target.checked })}
          />
          Montagem incluída
        </label>

        <label>Categories</label>
        <select
          multiple
          value={form.categoryIds}
          onChange={(e) => handleMultiSelect(e, "categoryIds")}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Materials</label>
        <select
          multiple
          value={form.materialIds}
          onChange={(e) => handleMultiSelect(e, "materialIds")}
        >
          {materials.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <label>Imagem do produto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit" className="btn-primary">Adicionar Produto</button>
      </form>

      <div className="cards-container">
        {products.map((p) => (
          <div className="card" key={p.id}>
            {p.img_blob_name ? (
              <img
                src={`http://localhost:3000/api/product/${p.id}/image`}
                alt={p.name}
                className="product-image"
              />
            ) : (
              <FaBox className="placeholder-icon" />
            )}
            <h3>{p.name}</h3>
            <p>Quantidade: {p.quantity}</p>
            <p>Dimensão: {p.dimension}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
