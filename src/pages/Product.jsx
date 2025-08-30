import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/Products.css";
import CartPage from "./CartPage";

export default function ProductPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/product/${slug}`, {
                    credentials: "include",
                });
                const json = await res.json();
                setProduct(json.data);
            } catch (err) {
                console.error("Erro ao carregar produto:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <p>Carregando produto...</p>;
    if (!product) return <p>Produto não encontrado</p>;

    const handleAddToCart = () => {
        // aqui você pode salvar no localStorage ou contexto do carrinho
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        navigate("/carrinho");
    };

    return (
        <div className="product-page">
            {/* IMAGEM DO PRODUTO */}
            <div className="product-image">
                <img
                    src={product.image || "https://via.placeholder.com/400x400"}
                    alt={product.name}
                />
            </div>

            {/* DETALHES */}
            <div className="product-details">
                <h1>{product.name}</h1>

                <p className="short-description">{product.short_description}</p>
                <p className="long-description">{product.long_description}</p>

                <p><strong>Estoque:</strong> {product.quantity} unidades</p>
                <p><strong>Dimensão:</strong> {product.dimension}</p>

                <button className="buy-btn" onClick={CartPage}>
                    Fazer Orçamento
                </button>
            </div>

        </div>
    );
}
