import React, { useEffect, useState } from "react";
import { FaBox, FaBoxes, FaTrash, FaEdit, FaPlus, FaSpinner } from "react-icons/fa";
import "./css/ProductAdmin.css";
import { useProductsContext } from "~/context/ProductsContext";
import { useProductImages } from "~/hooks/useProductImages";
import Modal from "~/components/Modal";
import { useTheme } from "~/context/ThemeContext";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const { products, setProducts } = useProductsContext();
  const { imageUrls, refetchImages } = useProductImages(products); // Assume que tem refetchImages
  const { darkMode } = useTheme();

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
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estados de loading e notificações
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

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
        showNotification("Erro ao carregar categorias e materiais", "error");
      }
    }
    fetchOptions();
  }, []);

  // Função para mostrar notificações
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Função para recarregar produtos
  const refreshProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/product/all`);
      const data = await res.json();
      setProducts(data.data || []);
      if (refetchImages) {
        await refetchImages();
      }
    } catch (err) {
      console.error("Erro ao recarregar produtos:", err);
      showNotification("Erro ao recarregar produtos", "error");
    }
  };

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
      throw err;
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
      throw err;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/product`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error("Erro ao criar produto");
      
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

      // Reset do formulário
      setForm({
        name: "",
        short_description: "",
        long_description: "",
        dimension: "",
        categoryIds: [],
        materialIds: [],
      });
      setImageFile(null);

      // Atualizar lista de produtos
      await refreshProducts();
      
      showNotification("Produto adicionado com sucesso!", "success");

    } catch (err) {
      console.error(err);
      showNotification("Erro ao adicionar produto", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteConfirm(result) {
    if (result && selectedProduct) {
      setIsDeleting(true);
      try {
        await deleteProductByIDFront(selectedProduct.id);
        
        // Atualizar lista removendo o produto
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        
        showNotification(`Produto "${selectedProduct.name}" deletado com sucesso!`, "success");
        
        // Se a página atual ficar vazia, voltar para a anterior
        const newTotalPages = Math.ceil((products.length - 1) / itemsPerPage);
        if (page > newTotalPages && newTotalPages > 0) {
          setPage(newTotalPages);
        }
        
      } catch (err) {
        console.error(err);
        showNotification("Erro ao deletar produto", "error");
      } finally {
        setIsDeleting(false);
      }
    }
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  }

  async function handleEditConfirm(result) {
    if (result && selectedProduct) {
      setIsEditing(true);
      try {
        const body = {
          name: selectedProduct.name,
          short_description: selectedProduct.short_description,
          long_description: selectedProduct.long_description,
          dimension: selectedProduct.dimension,
          categoryIds: selectedProduct.categories?.map((c) => c.id) || [],
          materialIds: selectedProduct.materials?.map((m) => m.id) || [],
        };
        
        const updated = await updateProductByIdFront(selectedProduct.id, body);
        
        // Atualizar produto na lista
        setProducts(
          products.map((p) => (p.id === selectedProduct.id ? updated.data : p))
        );
        
        showNotification(`Produto "${selectedProduct.name}" atualizado com sucesso!`, "success");
        
        // Recarregar para garantir dados atualizados
        setTimeout(() => refreshProducts(), 500);
        
      } catch (err) {
        console.error(err);
        showNotification("Erro ao atualizar produto", "error");
      } finally {
        setIsEditing(false);
      }
    }
    setIsEditOpen(false);
    setSelectedProduct(null);
  }

  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  return (
    <div className={`products-page ${darkMode ? 'dark-mode' : ''}`}>
      <h2 className="products-title">
        <FaBoxes /> Gerenciar Produtos
      </h2>

      {/* Notificação */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* ==== FORMULÁRIO ==== */}
      <form onSubmit={handleSubmit} className={`admin-form ${darkMode ? 'dark-mode' : ''}`}>
        <div className="form-group">
          <label>Nome do produto</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label>Dimensão (ex: 120x60x60)</label>
          <input
            type="text"
            value={form.dimension}
            onChange={(e) => setForm({ ...form, dimension: e.target.value })}
            disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
              disabled={isLoading}
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <label htmlFor="file-upload" className="file-upload-button">
              {imageFile ? imageFile.name : "Selecionar arquivo"}
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="spinner" />
          ) : (
            <FaPlus />
          )}
          <span className="btn-add-text">
            {isLoading ? "Adicionando..." : "Adicionar Produto"}
          </span>
        </button>
      </form>

      {/* ==== LISTAGEM ==== */}
      <div className="cards-container">
        {paginatedProducts.length === 0 ? (
          <div className="empty-state">
            <FaBox size={64} />
            <p>Nenhum produto encontrado</p>
          </div>
        ) : (
          paginatedProducts.map((p) => (
            <div className={`card ${darkMode ? 'dark-mode' : ''}`} key={p.id}>
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
                    disabled={isEditing || isDeleting}
                  >
                    {isEditing && selectedProduct?.id === p.id ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaEdit />
                    )}
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => {
                      setSelectedProduct(p);
                      setIsDeleteOpen(true);
                    }}
                    disabled={isEditing || isDeleting}
                  >
                    {isDeleting && selectedProduct?.id === p.id ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>

              <div className={`card-content ${darkMode ? 'dark-mode' : ''}`}>
                <h3>{p.name}</h3>
                <p>{p.short_description}</p>
                <p className="dimension-text">
                  <strong>Dimensão:</strong> {p.dimension}
                </p>
                <div className="categories">
                  {p.categories?.map((c) => (
                    <span key={c.id} className="category-tag">{c.name}</span>
                  ))}
                </div>
                <div className="materials">
                  {p.materials?.map((m) => (
                    <span key={m.id} className="material-tag">{m.name}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ==== PAGINAÇÃO ==== */}
      {totalPages > 1 && (
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
      )}

      {/* ==== MODAIS ==== */}
      <Modal
        isOpen={isDeleteOpen}
        onResult={handleDeleteConfirm}
        title="Deletar Produto"
        confirmText={isDeleting ? "Deletando..." : "Deletar"}
        cancelText="Cancelar"
      >
        <p>
          Tem certeza que deseja deletar{" "}
          <strong>{selectedProduct?.name}</strong>?
        </p>
        {isDeleting && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            <FaSpinner className="spinner" /> Processando...
          </p>
        )}
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onResult={handleEditConfirm}
        title="Editar Produto"
        confirmText={isEditing ? "Salvando..." : "Salvar"}
        cancelText="Cancelar"
      >
        {selectedProduct && (
          <>
            <div className="form-group">
              <label>Nome</label>
              <input
                value={selectedProduct.name}
                disabled={isEditing}
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
                disabled={isEditing}
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
                disabled={isEditing}
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
                disabled={isEditing}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    dimension: e.target.value,
                  })
                }
              />
            </div>
            {isEditing && (
              <p style={{ marginTop: '15px', color: '#666' }}>
                <FaSpinner className="spinner" /> Salvando alterações...
              </p>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}