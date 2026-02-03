import { FormData, FormErrors } from '../types/typesAuth';

export const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        return 'Email обязателен для заполнения';
    }
    if (!emailRegex.test(email)) {
        return 'Введите корректный email адрес';
    }
    return undefined;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password) {
        return 'Пароль обязателен для заполнения';
    }
    if (password.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
    }
    return undefined;
};

export const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    return newErrors;
};

export const validateField = (
    name: keyof FormData,
    value: string | boolean,
    formData: FormData,
    currentErrors: FormErrors
): FormErrors => {
    const newErrors = { ...currentErrors };

    // Удаляем ошибку только для полей, которые есть в FormErrors
    if (name === 'email' || name === 'password') {
        delete newErrors[name];
    }

    switch (name) {
        case 'email':
            const emailError = validateEmail(String(value));
            if (emailError) newErrors.email = emailError;
            break;
        case 'password':
            const passwordError = validatePassword(String(value));
            if (passwordError) newErrors.password = passwordError;
            break;
        case 'rememberMe':
            // rememberMe не требует валидации
            break;
    }

    return newErrors;
};