import React, { useEffect, useState } from "react";
import { FaBox, FaBoxes, FaTrash, FaEdit, FaPlus, FaSpinner } from "react-icons/fa";
import "./css/ProductAdmin.css";
import { useProductsContext } from "~/context/ProductsContext";
import { useProductImages } from "~/hooks/useProductImages";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import { useTheme } from "~/context/ThemeContext";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  
  const {
    products,
    setProducts,
    pagination,
    loading,
    page,
    setPage,
    setPerPage,
    setFilters,
  } = useProductsContext();

  const { imageUrls, refetchImages } = useProductImages(products);
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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Estados locais para controlar os inputs de filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");

  // Ajusta a quantidade de itens por página para o painel de admin
  useEffect(() => {
    setPerPage(6);
    return () => {
      setPerPage(12);
    };
  }, [setPerPage]);

  // Limpa os filtros do contexto ao carregar
  useEffect(() => {
    setFilters({});
  }, [setFilters]);

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
        console.error("Erro ao carregar opções:", err);
      }
    }
    fetchOptions();
  }, [API_URL]);

  const handleSearch = () => {
    setFilters({
      name: searchTerm,
      category: selectedCategory,
      material: selectedMaterial,
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedMaterial("");
    setFilters({});
    setPage(1);
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshProducts = () => {
    // Força uma nova busca mantendo os filtros atuais
    setFilters(prev => ({ ...prev }));
    refetchImages();
  };

  // IMPLEMENTAÇÃO DAS FUNÇÕES DE API QUE ESTAVAM FALTANDO
async function deleteProductByIDFront(id) {
    if (!id || typeof id !== "string") {
        throw new Error("ID do produto inválido");
    }

    try {
        const res = await fetch(`${API_URL}/products/${id.trim()}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // ajusta aqui
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Erro ao deletar produto");
        }

        console.log("Produto deletado com sucesso:", data);
        return data;
    } catch (err) {
        console.error("Erro ao deletar produto:", err);
        throw err; // opcional, pra poder tratar no modal
    }
}

  async function updateProductByIdFront(id, data) {
    try {
      const res = await fetch(`${API_URL}/product/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao atualizar produto");
      }
      
      return await res.json();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/product`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao criar produto");
      }
      
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
      
      setForm({ 
        name: "", 
        short_description: "", 
        long_description: "", 
        dimension: "", 
        categoryIds: [], 
        materialIds: [] 
      });
      setImageFile(null);
      refreshProducts();
      showNotification("Produto adicionado com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Erro ao adicionar produto", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm(result) {
    if (result && selectedProduct) {
      setIsDeleting(true);
      try {
        await deleteProductByIDFront(selectedProduct.id);
        showNotification(`Produto "${selectedProduct.name}" deletado com sucesso!`, "success");
        refreshProducts();
      } catch (err) {
        showNotification(err.message || "Erro ao deletar produto", "error");
      } finally {
        setIsDeleting(false);
        setIsDeleteOpen(false);
        setSelectedProduct(null);
      }
    } else {
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
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
        
        await updateProductByIdFront(selectedProduct.id, body);
        showNotification(`Produto "${selectedProduct.name}" atualizado com sucesso!`, "success");
        refreshProducts();
      } catch (err) {
        showNotification(err.message || "Erro ao atualizar produto", "error");
      } finally {
        setIsEditing(false);
        setIsEditOpen(false);
        setSelectedProduct(null);
      }
    } else {
      setIsEditOpen(false);
      setSelectedProduct(null);
    }
  }

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className={`products-page ${darkMode ? "dark-mode" : ""}`}>
      <h2 className="products-title"><FaBoxes /> Gerenciar Produtos</h2>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`admin-form ${darkMode ? "dark-mode" : ""}`}>
        <div className="form-group">
          <label>Nome do produto</label>
          <input 
            type="text" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            disabled={isSubmitting} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Descrição curta</label>
          <input 
            type="text" 
            value={form.short_description} 
            onChange={(e) => setForm({ ...form, short_description: e.target.value })} 
            disabled={isSubmitting} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Descrição longa</label>
          <textarea 
            value={form.long_description} 
            onChange={(e) => setForm({ ...form, long_description: e.target.value })} 
            disabled={isSubmitting} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Dimensão (ex: 120x60x60)</label>
          <input 
            type="text" 
            value={form.dimension} 
            onChange={(e) => setForm({ ...form, dimension: e.target.value })} 
            disabled={isSubmitting} 
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
                  disabled={isSubmitting} 
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
                  disabled={isSubmitting} 
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
              disabled={isSubmitting} 
              onChange={(e) => setImageFile(e.target.files[0])} 
            />
            <label htmlFor="file-upload" className="file-upload-button">
              {imageFile ? imageFile.name : "Selecionar arquivo"}
            </label>
          </div>
        </div>
        
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <FaSpinner className="spinner" /> : <FaPlus />}
          <span className="btn-add-text">
            {isSubmitting ? "Adicionando..." : "Adicionar Produto"}
          </span>
        </button>
      </form>

      {loading ? (
        <div className="loading-state">
          <FaSpinner className="spinner" /> Carregando produtos...
        </div>
      ) : (
        <>
          <div className={`admin-filters ${darkMode ? "dark-mode" : ""}`}>
            <input 
              type="text" 
              placeholder="Pesquisar por nome..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
              className="filter-input" 
            />
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="filter-select"
            >
              <option value="">Todas as Categorias</option>
              {categories.map((cat) => 
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              )}
            </select>
            
            <select 
              value={selectedMaterial} 
              onChange={(e) => setSelectedMaterial(e.target.value)} 
              className="filter-select"
            >
              <option value="">Todos os Materiais</option>
              {materials.map((mat) => 
                <option key={mat.id} value={mat.name}>{mat.name}</option>
              )}
            </select>

            <button onClick={handleClearFilters} className="clear-btn">
              Limpar
            </button>
            <button onClick={handleSearch} className="btn-primary">
              Pesquisar
            </button>
          </div>

          <div className="cards-container">
            {products.length === 0 ? (
              <div className="empty-state">
                <FaBox size={64} />
                <p>Nenhum produto encontrado</p>
              </div>
            ) : (
              products.map((p) => (
                <div className={`card ${darkMode ? "dark-mode" : ""}`} key={p.id}>
                  <div className="card-image">
                    {imageUrls[p.id] ? 
                      <img src={imageUrls[p.id]} alt={p.name} /> : 
                      <FaBox className="placeholder-icon" />
                    }
                    <div className="overlay">
                      <button 
                        className="icon-btn edit" 
                        onClick={() => { 
                          setSelectedProduct({ ...p }); 
                          setIsEditOpen(true); 
                        }} 
                        disabled={isEditing || isDeleting}
                      >
                        {isEditing && selectedProduct?.id === p.id ? 
                          <FaSpinner className="spinner" /> : 
                          <FaEdit />
                        }
                      </button>
                      
                      <button 
                        className="icon-btn delete" 
                        onClick={() => { 
                          setSelectedProduct(p); 
                          setIsDeleteOpen(true); 
                        }} 
                        disabled={isEditing || isDeleting}
                      >
                        {isDeleting && selectedProduct?.id === p.id ? 
                          <FaSpinner className="spinner" /> : 
                          <FaTrash />
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div className={`card-content ${darkMode ? "dark-mode" : ""}`}>
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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            darkMode={darkMode}
          />
        </>
      )}

      <Modal 
        isOpen={isDeleteOpen} 
        onResult={handleDeleteConfirm} 
        title="Deletar Produto" 
        confirmText={isDeleting ? "Deletando..." : "Deletar"} 
        cancelText="Cancelar"
      >
        <p>Tem certeza que deseja deletar <strong>{selectedProduct?.name}</strong>?</p>
        {isDeleting && (
          <p style={{ marginTop: "10px", color: "#666" }}>
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
                onChange={(e) => setSelectedProduct({ 
                  ...selectedProduct, 
                  name: e.target.value 
                })} 
              />
            </div>
            
            <div className="form-group">
              <label>Descrição Curta</label>
              <input 
                value={selectedProduct.short_description} 
                disabled={isEditing} 
                onChange={(e) => setSelectedProduct({ 
                  ...selectedProduct, 
                  short_description: e.target.value 
                })} 
              />
            </div>
            
            <div className="form-group">
              <label>Descrição Longa</label>
              <textarea 
                value={selectedProduct.long_description} 
                disabled={isEditing} 
                onChange={(e) => setSelectedProduct({ 
                  ...selectedProduct, 
                  long_description: e.target.value 
                })} 
              />
            </div>
            
            <div className="form-group">
              <label>Dimensão</label>
              <input 
                value={selectedProduct.dimension} 
                disabled={isEditing} 
                onChange={(e) => setSelectedProduct({ 
                  ...selectedProduct, 
                  dimension: e.target.value 
                })} 
              />
            </div>
            
            {isEditing && (
              <p style={{ marginTop: "15px", color: "#666" }}>
                <FaSpinner className="spinner" /> Salvando alterações...
              </p>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}