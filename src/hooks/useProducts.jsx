import { useState, useEffect } from "react";

<<<<<<< HEAD
export function useProducts() {
    const API_URL = import.meta.env.VITE_API_URL_V1;
=======
export function useProducts(initialPage = 1, initialPerPage = 12) {
>>>>>>> cdba2a55fe601a475df33b2656854de2f8a6d7b9
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
<<<<<<< HEAD
=======

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
>>>>>>> cdba2a55fe601a475df33b2656854de2f8a6d7b9
        fetchProducts();
    }, [page, perPage]);

<<<<<<< HEAD
    return { products, fetchProducts, loading }; // ✅ agora retorna fetchProducts
}
=======
    return { products, pagination, loading, page, setPage, perPage, setPerPage };
}
>>>>>>> cdba2a55fe601a475df33b2656854de2f8a6d7b9
