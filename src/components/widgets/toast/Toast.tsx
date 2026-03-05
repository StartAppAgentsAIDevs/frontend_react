import React, { useEffect } from 'react';
import { useToast } from './ToastProvider';
import './Toast.scss';

const Toast: React.FC = () => {
    const { toast, closeToast } = useToast();

    useEffect(() => {
        if (!toast.isVisible || toast.isClosing) return;

        const intervalDuration = 50;
        const totalSteps = 5000 / intervalDuration;
        const step = 100 / totalSteps;

        const timer = setInterval(() => {
        }, intervalDuration);

        return () => clearInterval(timer);
    }, [toast.isVisible, toast.isClosing]);

    if (!toast.isVisible) return null;

    return (
        <div className={`toast-overlay ${toast.isClosing ? 'toast-closing' : ''}`}>
            <div className={`toast toast-${toast.type}`}>
                <div className="toast-content">
                    <div className="toast-icon">
                        {toast.type === 'error' ? '❌' : toast.type === 'success' ? '✅' : 'ℹ️'}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                    <button className="toast-close" onClick={closeToast}>
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;