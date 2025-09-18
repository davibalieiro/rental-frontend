import React, { createContext, useReducer, useContext, useCallback, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL_V1;

const OrdersContext = createContext();

const initialState = {
    orders: [],
    pagination: { totalPages: 0, totalOrders: 0 },
    loading: true,
    error: null,
    // Estado de controle da UI agora vive aqui
    page: 1,
    perPage: 8,
    filters: {
        clientEmail: "",
        clientName: "",
        status: "",
    },
};

function ordersReducer(state, action) {
    switch (action.type) {
        case "FETCH_START":
            return { ...state, loading: true, error: null };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                orders: action.payload.data || [],
                pagination: action.payload.pagination || { totalPages: 0, totalOrders: 0 },
            };
        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload };

        case "SET_PAGE":
            if (action.payload === state.page) return state;
            return { ...state, page: action.payload };
        case "SET_FILTERS":
            return { ...state, filters: action.payload, page: 1 };

        case "UPDATE_ORDER":
            return {
                ...state,
                orders: state.orders.map((order) =>
                    order.id === action.payload.id ? { ...order, ...action.payload.data } : order
                ),
            };
        default:
            throw new Error(`Ação desconhecida: ${action.type}`);
    }
}

export function OrdersProvider({ children }) {
    const [state, dispatch] = useReducer(ordersReducer, initialState);

    useEffect(() => {
        const fetchOrdersInternal = async () => {
            dispatch({ type: "FETCH_START" });
            try {
                const params = new URLSearchParams({
                    page: state.page,
                    perPage: state.perPage,
                });

                if (state.filters.clientEmail) params.append("clientEmail", state.filters.clientEmail);
                if (state.filters.clientName) params.append("clientName", state.filters.clientName);
                if (state.filters.status) params.append("status", state.filters.status);

                const response = await fetch(`${API_URL}/admin/order/all?${params.toString()}`, {
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Falha ao buscar os pedidos.");

                dispatch({ type: "FETCH_SUCCESS", payload: result });
            } catch (err) {
                dispatch({ type: "FETCH_ERROR", payload: err.message });
            }
        };

        fetchOrdersInternal();
    }, [state.page, state.perPage, state.filters]);

    const setPage = useCallback((page) => {
        dispatch({ type: "SET_PAGE", payload: page });
    }, []);

    const setFilters = useCallback((filters) => {
        dispatch({ type: "SET_FILTERS", payload: filters });
    }, []);

    const updateOrder = useCallback((orderId, updatedData) => {
        dispatch({ type: "UPDATE_ORDER", payload: { id: orderId, data: updatedData } });
    }, []);

    // Opcional: Adicionar uma função para fazer refetch da página atual
    const refetch = useCallback(() => {
        // Esta é uma forma de forçar o refetch se necessário
        dispatch({ type: "SET_PAGE", payload: state.page });
    }, [state.page]);

    const value = { state, setPage, setFilters, updateOrder, refetch };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (!context) throw new Error("useOrders deve ser usado dentro de um OrdersProvider");
    return context;
}