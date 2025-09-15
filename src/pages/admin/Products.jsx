import React, { useEffect, useState } from "react";
import { FaBox, FaBoxes, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import "./css/ProductAdmin.css";
import { useProductsContext } from "~/context/ProductsContext";
import { useProductImages } from "~/hooks/useProductImages";
import Modal from "~/components/Modal";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const { products, setProducts } = useProductsContext(); // 🔥 agora usamos setProducts
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

  // Paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ================= FETCH OPTIONS =================
  useEffect(() => {
    async function fetchOptions() {
      try {
        const catRes = await fetch(`${API_URL}/category/all`);
        const matRes = await fetch(`${API_URL}/material/all`);
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

  // ================= AUX FUNCTIONS =================
  async function deleteProductByIDFront(id) {
    try {
      const res = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao deletar produto");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateProductByIdFront(id, data) {
    try {
      const res = await fetch(`${API_URL}/product/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar produto");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // ================= HANDLE FORM =================
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/product`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      const newProduct = json.data;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await fetch(`${API_URL}/upload-image/${newProduct.id}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }

      // resetar form
      setForm({
        name: "",
        short_description: "",
        long_description: "",
        dimension: "",
        categoryIds: [],
        materialIds: [],
      });
      setImageFile(null);

      // 🔥 Atualizar contexto sem refetch
      setProducts([...products, newProduct]);
    } catch (err) {
      console.error(err);
    }
  }

  // ================= HANDLE DELETE =================
  async function handleDeleteConfirm(result) {
    if (result && selectedProduct) {
      await deleteProductByIDFront(selectedProduct.id);
      // 🔥 remove da lista local também
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
    }
    setIsDeleteOpen(false);
  }

  // ================= HANDLE EDIT =================
  async function handleEditConfirm(result) {
    if (result && selectedProduct) {
      const body = {
        name: selectedProduct.name,
        short_description: selectedProduct.short_description,
        long_description: selectedProduct.long_description,
        dimension: selectedProduct.dimension,
        categoryIds: selectedProduct.categories?.map((c) => c.id),
        materialIds: selectedProduct.materials?.map((m) => m.id),
      };
      const updated = await updateProductByIdFront(selectedProduct.id, body);

      // 🔥 atualizar no contexto
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? updated.data : p))
      );
    }
    setIsEditOpen(false);
  }

  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="products-page">
      <h2>
        <FaBoxes /> Gerenciar Produtos
      </h2>

      {/* ==== FORMULÁRIO ==== */}
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
            onChange={(e) =>
              setForm({ ...form, short_description: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição longa</label>
          <textarea
            value={form.long_description}
            onChange={(e) =>
              setForm({ ...form, long_description: e.target.value })
            }
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

        <button type="submit" className="btn-primary">
          <FaPlus /> <span style={{ marginLeft: '10px' }}>Adicionar Produto</span>
        </button>
      </form>

      {/* ==== LISTAGEM ==== */}
      <div className="cards-container">
        {paginatedProducts.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-image">
              {imageUrls[p.id] ? (
                <img src={imageUrls[p.id]} alt={p.name} />
              ) : (
                <FaBox className="placeholder-icon" />
              )}
              <div className="overlay">
                <button
                  className="icon-btn edit"
                  onClick={() => {
                    setSelectedProduct({ ...p });
                    setIsEditOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn delete"
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsDeleteOpen(true);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="card-content">
              <h3>{p.name}</h3>
              <p>{p.short_description}</p>
              <p>
                <strong>Dimensão:</strong> {p.dimension}
              </p>
              <div className="categories">
                {p.categories?.map((c) => (
                  <span key={c.id}>{c.name}</span>
                ))}
              </div>
              <div className="materials">
                {p.materials?.map((m) => (
                  <span key={m.id}>{m.name}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ==== PAGINAÇÃO ==== */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="page-btn"
        >
          ◀ Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="page-btn"
        >
          Próxima ▶
        </button>
      </div>

      {/* ==== MODAIS ==== */}
      <Modal
        isOpen={isDeleteOpen}
        onResult={handleDeleteConfirm}
        title="Deletar Produto"
        confirmText="Deletar"
        cancelText="Cancelar"
      >
        <p>
          Tem certeza que deseja deletar{" "}
          <strong>{selectedProduct?.name}</strong>?
        </p>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onResult={handleEditConfirm}
        title="Editar Produto"
        confirmText="Salvar"
        cancelText="Cancelar"
      >
        {selectedProduct && (
          <>
            <div className="form-group">
              <label>Nome</label>
              <input
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Descrição Curta</label>
              <input
                value={selectedProduct.short_description}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    short_description: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Descrição Longa</label>
              <textarea
                value={selectedProduct.long_description}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    long_description: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Dimensão</label>
              <input
                value={selectedProduct.dimension}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    dimension: e.target.value,
                  })
                }
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
