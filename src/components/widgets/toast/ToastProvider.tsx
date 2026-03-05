import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    type: ToastType;
    isVisible: boolean;
    isClosing: boolean;
    progress: number;
}

interface ToastContextType {
    toast: ToastState;
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    closeToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'info',
        isVisible: false,
        isClosing: false,
        progress: 100,
    });

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
        if (toast.isVisible) {
            setToast(prev => ({ ...prev, isClosing: true }));

            setTimeout(() => {
                setToast({
                    message,
                    type,
                    isVisible: true,
                    isClosing: false,
                    progress: 100,
                });
            }, 300);
        } else {
            setToast({
                message,
                type,
                isVisible: true,
                isClosing: false,
                progress: 100,
            });
        }

        if (duration > 0) {
            setTimeout(() => {
                closeToast();
            }, duration);
        }
    }, [toast.isVisible]);

    const closeToast = useCallback(() => {
        setToast(prev => ({ ...prev, isClosing: true }));
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false, isClosing: false, progress: 100 }));
        }, 300);
    }, []);

    const value: ToastContextType = {
        toast,
        showToast,
        closeToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};