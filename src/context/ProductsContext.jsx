import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext();


const API_URL = import.meta.env.VITE_API_URL_V1;

export function ProductsProvider({ children }) {
    const [productsCache, setProductsCache] = useState({});
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);

    useEffect(() => {
        const fetchProducts = async () => {
            if (productsCache[page]) {
                setPagination(productsCache[page].pagination);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/product/all?page=${page}&perPage=${perPage}`,
                    { credentials: "include" }
                );
                const json = await res.json();
                const data = json.response.data || [];
                const pagePagination = json.response.pagination || null;

                setProductsCache((prev) => ({
                    ...prev,
                    [page]: { data, pagination: pagePagination },
                }));

                setPagination(pagePagination);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, perPage, productsCache]);

    const products = productsCache[page]?.data || [];

    return (
        <ProductsContext.Provider
            value={{ products, pagination, loading, page, setPage, perPage, setPerPage }}
        >
            {children}
        </ProductsContext.Provider>
    );
}

export function useProductsContext() {
    return useContext(ProductsContext);
}
