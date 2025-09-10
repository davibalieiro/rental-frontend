import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./css/MinhasReservas.css";

export default function MinhasReservas() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🔹 MUITO IMPORTANTE para cookies HttpOnly
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar suas reservas. Status: ${res.status}`);
        }

        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error("Erro no fetchOrders:", err);
        setError("Não foi possível carregar suas reservas.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Carregando reservas...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p className="empty">Você não possui reservas.</p>;

  return (
    <div className="minhas-reservas-container">
      <h1 className="title">Minhas Reservas</h1>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h2>Pedido #{order.id}</h2>
              <span
                className={`status ${
                  order.status === "CANCELLED"
                    ? "cancelled"
                    : order.status === "COMPLETED"
                    ? "completed"
                    : "pending"
                }`}
              >
                {order.status === "CANCELLED" && <FaTimesCircle />}
                {order.status === "COMPLETED" && <FaCheckCircle />}
                {order.status !== "CANCELLED" && order.status !== "COMPLETED" && <FaRegCalendarAlt />}
                {" "}{order.status}
              </span>
            </div>
            <p>
              <FaRegCalendarAlt className="icon" /> <strong>Data do pedido:</strong>{" "}
              {new Date(order.order_date).toLocaleDateString()}
            </p>
            <p>
              <FaRegCalendarAlt className="icon" /> <strong>Data prevista:</strong>{" "}
              {new Date(order.target_date).toLocaleDateString()}
            </p>
            <div className="products">
              <h3>Produtos:</h3>
              <ul>
                {order.orderProducts.map((op) => (
                  <li key={op.productId}>
                    {op.name} - {op.dimension} - Quantidade: {op.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
