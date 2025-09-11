import { useState, useEffect } from "react";

export function useProducts() {
    const API_URL = import.meta.env.VITE_API_URL_V1;
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(initialPerPage);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/product/all`, {
                credentials: "include",
            });
            const json = await res.json();
            setProducts(json.data || []);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, perPage]);

    return { products, fetchProducts, loading }; // ✅ agora retorna fetchProducts
}

