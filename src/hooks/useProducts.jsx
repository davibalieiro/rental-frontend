import { useState, useEffect } from "react";

export function useProducts(initialPage = 1, initialPerPage = 12) {
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

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/product/all?page=${page}&perPage=${perPage}`,
                    { credentials: "include" }
                );
                const json = await res.json();
                setProducts(json.response.data || []);
                setPagination(json.response.pagination || null);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, perPage]);
    return { products, pagination, loading, page, setPage, perPage, setPerPage };
}
