import { FormData, FormErrors } from '../types/typesRegister';

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

    if (!formData.first_name.trim()) {
        newErrors.first_name = 'Имя обязательно для заполнения';
    } else if (formData.first_name.trim().length < 2) {
        newErrors.first_name = 'Имя должно содержать минимум 2 символа';
    }

    if (!formData.last_name.trim()) {
        newErrors.last_name = 'Фамилия обязательна для заполнения';
    } else if (formData.last_name.trim().length < 2) {
        newErrors.last_name = 'Фамилия должна содержать минимум 2 символа';
    }

    if (!formData.organization_name.trim()) {
        newErrors.organization_name = 'НО обязательно для заполнения';
    } else if (formData.organization_name.trim().length < 3) {
        newErrors.organization_name = 'НО должна содержать минимум 3 символа';
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
        newErrors.email = emailError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
        newErrors.password = passwordError;
    }

    if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Повторите пароль';
    } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Необходимо соглашение';
    }

    return newErrors;
};

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
        case 'organization_name':
            if (!String(value).trim()) {
                newErrors.organization_name = 'НО обязательно для заполнения';
            } else if (String(value).trim().length < 3) {
                newErrors.organization_name = 'НО должна содержать минимум 3 символа';
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