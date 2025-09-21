import React, { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext();
const API_URL = import.meta.env.VITE_API_URL_V1;

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                    if (value) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});

                const queryParams = new URLSearchParams({
                    page,
                    perPage,
                    ...activeFilters,
                });

                const res = await fetch(`${API_URL}/products?${queryParams}`, {
                    credentials: "include",
                });
                const json = await res.json();

                setProducts(json.data || []);
                setPagination(json.pagination || null);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, perPage, filters]);

    return (
        <ProductsContext.Provider
            value={{ products, pagination, loading, page, setPage, perPage, setPerPage, filters, setFilters }}
        >
            {children}
        </ProductsContext.Provider>
    );
}

export function useProductsContext() {
    return useContext(ProductsContext);
}