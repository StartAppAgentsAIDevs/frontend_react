import React from 'react';
import './DeleteConfirmationModal.scss';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // Убрали параметр hardDelete
    integrationName: string;
    isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    integrationName,
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <h2 className="modal-title">Удаление интеграции</h2>
                
                <p className="modal-message">
                    Вы действительно хотите удалить интеграцию <strong>"{integrationName}"</strong>?
                </p>
                
                <div className="modal-warning">
                    <p>Это действие нельзя отменить. Все данные интеграции будут безвозвратно удалены.</p>
                </div>

                <div className="modal-actions">
                    <button 
                        className="modal-btn modal-btn--cancel"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Отмена
                    </button>
                    
                    <button 
                        className="modal-btn modal-btn--delete"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;