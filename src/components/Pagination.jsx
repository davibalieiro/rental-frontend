import React from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import "./css/Pagination.css"; // Vamos criar este arquivo de estilo a seguir

export default function Pagination({ currentPage, totalPages, onPageChange, darkMode }) {
    // Função para gerar os números das páginas a serem exibidos
    const getPageNumbers = () => {
        // Se houver 5 páginas ou menos, mostre todas
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Se houver mais de 5 páginas, aplique a lógica "1, 2, ..., n-1, n"
        // Usamos um Set para evitar números duplicados, caso a página atual esteja no início/fim
        const pages = new Set();
        pages.add(1);
        pages.add(2);
        pages.add(totalPages - 1);
        pages.add(totalPages);

        // Adiciona a página atual se ela não estiver no conjunto inicial
        if (currentPage > 2 && currentPage < totalPages - 1) {
            pages.add(currentPage);
        }

        // Converte para array, ordena e adiciona os "..." onde houver saltos
        const result = [];
        const sortedPages = Array.from(pages).sort((a, b) => a - b);

        let lastPage = 0;
        for (const page of sortedPages) {
            if (lastPage !== 0 && page - lastPage > 1) {
                result.push('...');
            }
            result.push(page);
            lastPage = page;
        }

        return result;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) {
        return null; // Não renderiza nada se houver apenas uma página
    }

    return (
        <div className={`pagination ${darkMode ? "dark-mode" : ""}`}>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="page-btn nav-btn"
            >
                <FaCaretLeft /> Anterior
            </button>

            {pageNumbers.map((page, index) =>
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="ellipsis">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`page-btn ${currentPage === page ? "active" : ""}`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="page-btn nav-btn"
            >
                Próxima <FaCaretRight />
            </button>
        </div>
    );
}