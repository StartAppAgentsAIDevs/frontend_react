import { useState, useEffect } from 'react';

export interface ToastState {
    message: string;
    type: 'error' | 'success';
    isVisible: boolean;
    isClosing: boolean;
    progress: number;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'error',
        isVisible: false,
        isClosing: false,
        progress: 100,
    });

    const showToast = (message: string, type: 'error' | 'success' = 'error', duration: number = 5000) => {
        setToast({
            message,
            type,
            isVisible: true,
            isClosing: false,
            progress: 100,
        });

        setTimeout(() => {
            closeToast();
        }, duration);
    };

    const closeToast = () => {
        setToast(prev => ({
            ...prev,
            isClosing: true,
        }));

        setTimeout(() => {
            setToast(prev => ({
                ...prev,
                isVisible: false,
                isClosing: false,
            }));
        }, 300);
    };

    // Прогресс бар для Toast
    useEffect(() => {
        if (!toast.isVisible || toast.isClosing) return;

        const intervalDuration = 50;
        const totalSteps = 5000 / intervalDuration;
        const step = 100 / totalSteps;

        const timer = setInterval(() => {
            setToast(prev => ({
                ...prev,
                progress: Math.max(0, prev.progress - step),
            }));
        }, intervalDuration);

        return () => clearInterval(timer);
    }, [toast.isVisible, toast.isClosing]);

    return {
        toast,
        showToast,
        closeToast,
    };
};