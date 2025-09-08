import React from 'react';
import '../pages/css/Modal.css';

export default function Modal({
    isOpen,
    onResult,
    title,
    children,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false
}) {
    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (!isLoading) {
            onResult(true);
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            onResult(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close-btn" onClick={handleCancel}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleCancel} disabled={isLoading}>
                        {cancelText}
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Processando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}