import React, { useState, useEffect } from "react";
import './css/ConcludeOrder.css';
import { useUserContext } from "~/context/UserContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { FaSpinner } from "react-icons/fa";


export default function ConcludeOrder() {
    const navigate = useNavigate();
    const { user, loading } = useUserContext();

    const API_URL = import.meta.env.VITE_API_URL_V1;

    const [cartProducts, setCartProducts] = useState([]);
    const [coupon, setCoupon] = useState(null);
    const [cartNotes, setCartNotes] = useState('');

    const [targetDate, setTargetDate] = useState('');
    const [initialDate, setInitialDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user, navigate]);



    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            const storedCoupon = localStorage.getItem('coupon');
            const storedNotes = localStorage.getItem('cartNotes');

            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCartProducts(Array.isArray(parsedCart) ? parsedCart : []);
            }
            if (storedCoupon) {
                setCoupon(JSON.parse(storedCoupon));
            }
            if (storedNotes) {
                setCartNotes(storedNotes);
            }
        } catch (e) {
            console.error("Falha ao carregar dados do localStorage:", e);
            setError("Houve um problema ao carregar os dados do seu pedido.");
        }
    }, []);

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const formatDateTimeForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:00`;
    };


    const handleReviewOrder = (event) => {
        event.preventDefault();
        setError(null);

        if (!targetDate) {
            setError("Por favor, selecione a data de entrega/retirada.");
            return;
        }
        if (cartProducts.length === 0) {
            setError("Seu carrinho está vazio.");
            return;
        }

        setIsModalOpen(true);
    };

    const handleConfirmOrder = async () => {
        setIsLoading(true);
        setError(null);

        const orderPayload = {
            target_date: new Date(targetDate).toISOString(),
            products: cartProducts.map(p => ({ productId: p.id, quantity: p.quantity || 1 })),
        };
        if (initialDate) {
            orderPayload.initial_date = new Date(initialDate).toISOString();
        }

        try {
            const orderResponse = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(orderPayload),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || 'Falha ao criar o pedido.');
            }

            if (coupon && coupon.id) {
                const couponResponse = await fetch(`${API_URL}/coupons/use/${coupon.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({}),
                });
                if (!couponResponse.ok) {
                    const errorData = await couponResponse.json();
                    console.warn("Pedido criado, mas houve um erro ao usar o cupom:", errorData.message);
                }
            }

            localStorage.removeItem('cart');
            localStorage.removeItem('coupon');
            localStorage.removeItem('cartNotes');

            alert('Pedido realizado com sucesso!');
            navigate('/pedidos');

        } catch (err) {
            setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };

    const handleModalResult = (confirmed) => {
        if (confirmed) {
            handleConfirmOrder();
        } else {
            setIsModalOpen(false);
        }
    };

    if (cartProducts.length === 0 && !isLoading) {
        return (
            <div className="conclude-order-container">
                <h1>Carrinho Vazio</h1>
                <p>Você ainda não adicionou produtos ao seu carrinho.</p>
                <button onClick={() => navigate('/produtos')}>Ver Produtos</button>
            </div>
        );
    }

    if (loading) return <FaSpinner />;

    return (
        <div className="conclude-order-container">
            <h1>Finalizar Pedido</h1>
            <form onSubmit={handleReviewOrder} className="order-form">
                <div className="order-summary">
                    <h2>Resumo do Pedido</h2>
                    <p><strong>Cliente:</strong> {user?.name || 'Não identificado'}</p>
                    <p><strong>Email:</strong> {user?.email || 'Não identificado'}</p>
                    <h3>Produtos</h3>
                    <ul className="product-list">
                        {cartProducts.map(product => (
                            <li key={product.id}>
                                <span>{product.name}</span>
                                <span>Quantidade: {product.quantity || 1}</span>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <p><strong>Cupom Aplicado:</strong> {coupon?.code || 'Nenhum'}</p>
                    <p><strong>Observações:</strong> {cartNotes || 'Nenhuma'}</p>
                </div>

                <div className="delivery-details">
                    <h2>Detalhes da Entrega</h2>
                    <div className="form-group">
                        <label htmlFor="target_date">Data de Entrega/Retirada *</label>
                        <input
                            type="datetime-local"
                            id="target_date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            min={getMinDateTime()}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="initial_date">Disponível para Entrega a partir de (Opcional)</label>
                        <input
                            type="datetime-local"
                            id="initial_date"
                            value={initialDate}
                            onChange={(e) => setInitialDate(e.target.value)}
                            min={getMinDateTime()}
                        />
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Processando...' : 'Revisar e Confirmar Pedido'}
                </button>
            </form>

            <Modal
                isOpen={isModalOpen}
                onResult={handleModalResult}
                title="Confirmação do Pedido"
                isLoading={isLoading}
            >
                <p>Por favor, confirme os detalhes do seu pedido antes de finalizar.</p>
                <div style={{ margin: '1rem 0', padding: '1rem', background: '#f1f1f1ff', borderRadius: '5px' }}>
                    <p><strong>Data de Entrega:</strong> {formatDateTimeForDisplay(targetDate)}</p>
                    {initialDate && (
                        <p><strong>Disponível a partir de:</strong> {formatDateTimeForDisplay(initialDate)}</p>
                    )}
                    <p><strong>Total de Itens:</strong> {cartProducts.reduce((acc, p) => acc + (p.quantity || 1), 0)}</p>
                </div>
                <p>Ao confirmar, o pedido será enviado para processamento.</p>
            </Modal>
        </div>
    );
}