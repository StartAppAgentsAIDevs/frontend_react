import { CreateProjectRequest } from "../../../../../types/project";

export interface ValidationRule<T> {
    validate: (value: T) => string | null;
    message: string;
}

export interface ValidationErrors {
    name?: string;
    organization_id?: string;
    platform_type?: string;
    timezone?: string;
    language?: string;
}

export const validateProjectForm = (data: CreateProjectRequest): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Валидация названия проекта
    if (!data.name.trim()) {
        errors.name = 'Введите название проекта';
    } else if (data.name.length < 3) {
        errors.name = 'Название должно содержать минимум 3 символа';
    } else if (data.name.length > 100) {
        errors.name = 'Название не должно превышать 100 символов';
    }

    // Валидация организации
    if (!data.organization_id) {
        errors.organization_id = 'Выберите организацию';
    }

    // Валидация типа платформы
    if (!data.platform_type) {
        errors.platform_type = 'Выберите тип платформы';
    }

    return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
    return Object.keys(errors).length > 0;
};

export const getFieldError = (errors: ValidationErrors, field: keyof ValidationErrors): string | null => {
    return errors[field] || null;
};