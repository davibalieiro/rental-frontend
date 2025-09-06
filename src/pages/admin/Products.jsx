import React, { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import "./css/ProductAdmin.css";
import { useProducts } from "~/hooks/useProducts";
import { useProductImages } from "~/hooks/useProductImages";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const { products } = useProducts();
  const { imageUrls } = useProductImages(products);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    long_description: "",
    dimension: "",
    categoryIds: [],
    materialIds: [],
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const catRes = await fetch(`${API_URL}/api/category/all`);
        const matRes = await fetch(`${API_URL}/api/material/all`);
        const catData = await catRes.json();
        const matData = await matRes.json();
        setCategories(catData.data || []);
        setMaterials(matData.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOptions();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/product`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      const productId = json.data.id;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await fetch(`${API_URL}/api/upload-image/${productId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }

      setForm({
        name: "",
        short_description: "",
        long_description: "",
        dimension: "",
        categoryIds: [],
        materialIds: [],
      });
      setImageFile(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="products-page">
      <h2>📦 Gerenciar Produtos</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Nome do produto</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição curta</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição longa</label>
          <textarea
            value={form.long_description}
            onChange={(e) => setForm({ ...form, long_description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Dimensão (ex: 120x60x60)</label>
          <input
            type="text"
            value={form.dimension}
            onChange={(e) => setForm({ ...form, dimension: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoria(s)</label>
          <div className="checkbox-group">
            {categories.map((c) => (
              <label key={c.id} className="checkbox-item">
                <input
                  type="checkbox"
                  value={c.id}
                  checked={form.categoryIds.includes(c.id)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...form.categoryIds, c.id]
                      : form.categoryIds.filter((id) => id !== c.id);
                    setForm({ ...form, categoryIds: updated });
                  }}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Material(is)</label>
          <div className="checkbox-group">
            {materials.map((m) => (
              <label key={m.id} className="checkbox-item">
                <input
                  type="checkbox"
                  value={m.id}
                  checked={form.materialIds.includes(m.id)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...form.materialIds, m.id]
                      : form.materialIds.filter((id) => id !== m.id);
                    setForm({ ...form, materialIds: updated });
                  }}
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <div className="form-group">
            <label>Imagem do produto</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="file-upload-button">
                {imageFile ? imageFile.name : "Selecionar arquivo"}
              </label>
            </div>
          </div>

        </div>

        <button type="submit" className="btn-primary">
          ➕ Adicionar Produto
        </button>
      </form>

      <div className="cards-container">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-image">
              {imageUrls[p.id] ? (
                <img src={imageUrls[p.id]} alt={p.name} />
              ) : (
                <FaBox className="placeholder-icon" />
              )}
              <div className="overlay">
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Deletar</button>
              </div>
            </div>

            <div className="card-content">
              <h3>{p.name}</h3>
              <p>{p.short_description}</p>
              <p>
                <strong>Dimensão:</strong> {p.dimension}
              </p>
              <div className="categories">{p.categories?.map((c) => <span key={c.id}>{c.name}</span>)}</div>
              <div className="materials">{p.materials?.map((m) => <span key={m.id}>{m.name}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
