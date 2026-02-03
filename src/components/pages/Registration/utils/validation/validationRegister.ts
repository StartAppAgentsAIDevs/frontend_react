import { FormData, FormErrors } from '../types/typesRegister';

// Вспомогательная функция для валидации email
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

// Вспомогательная функция для валидации пароля
export const validatePassword = (password: string): string | undefined => {
    if (!password) {
        return 'Пароль обязателен для заполнения';
    }
    if (password.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
    }
    return undefined;
};

// Валидация всей формы
export const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    // Валидация имени
    if (!formData.first_name.trim()) {
        newErrors.first_name = 'Имя обязательно для заполнения';
    } else if (formData.first_name.trim().length < 2) {
        newErrors.first_name = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация фамилии
    if (!formData.last_name.trim()) {
        newErrors.last_name = 'Фамилия обязательна для заполнения';
    } else if (formData.last_name.trim().length < 2) {
        newErrors.last_name = 'Фамилия должна содержать минимум 2 символа';
    }

    // Валидация email
    const emailError = validateEmail(formData.email);
    if (emailError) {
        newErrors.email = emailError;
    }

    // Валидация пароля
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
        newErrors.password = passwordError;
    }

    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Повторите пароль';
    } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
    }

    // Валидация согласия с условиями
    if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Необходимо соглашение';
    }

    return newErrors;
};

// Валидация отдельного поля
export const validateField = (
    name: keyof FormData,
    value: string | boolean,
    formData: FormData,
    currentErrors: FormErrors
): FormErrors => {
    const newErrors = { ...currentErrors };
    delete newErrors[name];

    switch (name) {
        case 'first_name':
            if (!String(value).trim()) {
                newErrors.first_name = 'Имя обязательно для заполнения';
            } else if (String(value).trim().length < 2) {
                newErrors.first_name = 'Имя должно содержать минимум 2 символа';
            }
            break;
        case 'last_name':
            if (!String(value).trim()) {
                newErrors.last_name = 'Фамилия обязательна для заполнения';
            } else if (String(value).trim().length < 2) {
                newErrors.last_name = 'Фамилия должна содержать минимум 2 символа';
            }
            break;
        case 'email':
            const emailError = validateEmail(String(value));
            if (emailError) {
                newErrors.email = emailError;
            }
            break;
        case 'password':
            const passwordError = validatePassword(String(value));
            if (passwordError) {
                newErrors.password = passwordError;
            }
            // Если есть ошибка подтверждения пароля, перепроверим
            if (currentErrors.confirmPassword && formData.confirmPassword) {
                if (String(value) !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Пароли не совпадают';
                } else {
                    delete newErrors.confirmPassword;
                }
            }
            break;
        case 'confirmPassword':
            if (!String(value)) {
                newErrors.confirmPassword = 'Повторите пароль';
            } else if (String(value) !== formData.password) {
                newErrors.confirmPassword = 'Пароли не совпадают';
            }
            break;
        case 'agreeTerms':
            if (!value) {
                newErrors.agreeTerms = 'Необходимо согласиться с пользовательским соглашением';
            }
            break;
    }

    return newErrors;
};