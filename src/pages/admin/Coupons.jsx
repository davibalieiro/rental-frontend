import React, { useEffect, useState } from "react";
import "./css/Coupons.css";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({
    text: "",
    benefit: "PERCENTAGE_DISCOUNT",
    expiresIn: "",
    isPublic: true,
    allowedUsers: [],
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/coupons/all", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao buscar cupons");
      const data = await res.json();
      setCoupons(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const url = editingCoupon
        ? `http://localhost:3000/api/coupons/${editingCoupon.id}`
        : "http://localhost:3000/api/coupons";
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao salvar cupom");
      }

      setForm({
        text: "",
        benefit: "PERCENTAGE_DISCOUNT",
        expiresIn: "",
        isPublic: true,
        allowedUsers: [],
      });
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar este cupom?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao deletar cupom");
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      text: coupon.text,
      benefit: coupon.benefit,
      expiresIn: coupon.expiresIn?.slice(0, 10),
      isPublic: coupon.isPublic,
      allowedUsers: coupon.allowedUsers?.map((u) => u.id) || [],
    });
  };

  if (loading) return <p className="loading-text">Carregando cupons...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="coupons-container">
      <h2>Cupons</h2>

      <div className="coupon-form">
        <input
          name="text"
          placeholder="Descrição do cupom"
          value={form.text}
          onChange={handleInput}
          className="input-field"
        />
        <select
          name="benefit"
          value={form.benefit}
          onChange={handleInput}
          className="input-field"
        >
          <option value="PERCENTAGE_DISCOUNT">Desconto %</option>
          <option value="FIXED_DISCOUNT">Desconto fixo</option>
          <option value="BONUS_ITEM">Item bônus</option>
        </select>
        <input
          type="date"
          name="expiresIn"
          value={form.expiresIn}
          onChange={handleInput}
          className="input-field"
        />
        <label className="checkbox-label">
          Público:
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleInput}
          />
        </label>
        <div className="form-buttons">
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editingCoupon ? "Atualizar Cupom" : "Criar Cupom"}
          </button>
          {editingCoupon && (
            <button
              className="btn btn-cancel"
              onClick={() => {
                setEditingCoupon(null);
                setForm({
                  text: "",
                  benefit: "PERCENTAGE_DISCOUNT",
                  expiresIn: "",
                  isPublic: true,
                  allowedUsers: [],
                });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="coupons-list">
        {coupons.map((c) => (
          <div key={c.id} className="coupon-card">
            <p className="coupon-text">
              <strong>{c.text}</strong> - Código: {c.code}
            </p>
            <p>Benefício: {c.benefit}</p>
            <p>Expira em: {new Date(c.expiresIn).toLocaleDateString()}</p>
            <p>Público: {c.isPublic ? "Sim" : "Não"}</p>
            <div className="card-buttons">
              <button className="btn btn-edit" onClick={() => handleEdit(c)}>
                Editar
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(c.id)}>
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
