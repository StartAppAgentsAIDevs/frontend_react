import { CreateIntegrationRequest, IntegrationFormData } from '../../../../../types/integrations';

export interface ValidationErrors {
    name?: string;
    subdomain?: string;
    access_token?: string;
    client_id?: string;
    client_secret?: string;
    new_lead_pipeline_id?: string;
    existing_lead_pipeline_id?: string;
    responsible_user_id?: string;
    telegram_field_id?: string;
}

// Интерфейс для данных валидации (все поля как строки)
export interface ValidationData {
    name: string;
    subdomain: string;
    access_token: string;
    client_id: string;
    client_secret: string;
    new_lead_pipeline_id: string;
    existing_lead_pipeline_id: string;
    responsible_user_id: string;
    telegram_field_id: string;
    is_active: boolean;
}

export const validateIntegrationForm = (data: ValidationData): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Валидация названия
    if (!data.name.trim()) {
        errors.name = 'Название интеграции обязательно';
    } else if (data.name.length < 3) {
        errors.name = 'Название должно содержать минимум 3 символа';
    } else if (data.name.length > 100) {
        errors.name = 'Название не должно превышать 100 символов';
    }

    // Валидация subdomain
    if (!data.subdomain.trim()) {
        errors.subdomain = 'Subdomain обязателен';
    } else if (!/^[a-zA-Z0-9-]+$/.test(data.subdomain)) {
        errors.subdomain = 'Subdomain может содержать только буквы, цифры и дефисы';
    }

    // Валидация access_token
    if (!data.access_token.trim()) {
        errors.access_token = 'Access token обязателен';
    } else if (data.access_token.length < 10) {
        errors.access_token = 'Access token должен содержать минимум 10 символов';
    }

    // Валидация client_id
    if (!data.client_id.trim()) {
        errors.client_id = 'Client ID обязателен';
    }

    // Валидация client_secret
    if (!data.client_secret.trim()) {
        errors.client_secret = 'Client secret обязателен';
    } else if (data.client_secret.length < 10) {
        errors.client_secret = 'Client secret должен содержать минимум 10 символов';
    }

    // Валидация pipeline_id
    if (!data.new_lead_pipeline_id.trim()) {
        errors.new_lead_pipeline_id = 'ID воронки для новых сделок обязателен';
    } else if (!/^\d+$/.test(data.new_lead_pipeline_id)) {
        errors.new_lead_pipeline_id = 'Должно быть целое число';
    } else if (Number(data.new_lead_pipeline_id) <= 0) {
        errors.new_lead_pipeline_id = 'ID должен быть положительным числом';
    }

    if (!data.existing_lead_pipeline_id.trim()) {
        errors.existing_lead_pipeline_id = 'ID воронки для существующих сделок обязателен';
    } else if (!/^\d+$/.test(data.existing_lead_pipeline_id)) {
        errors.existing_lead_pipeline_id = 'Должно быть целое число';
    } else if (Number(data.existing_lead_pipeline_id) <= 0) {
        errors.existing_lead_pipeline_id = 'ID должен быть положительным числом';
    }

    // Валидация responsible_user_id
    if (!data.responsible_user_id.trim()) {
        errors.responsible_user_id = 'ID ответственного пользователя обязателен';
    } else if (!/^\d+$/.test(data.responsible_user_id)) {
        errors.responsible_user_id = 'Должно быть целое число';
    } else if (Number(data.responsible_user_id) <= 0) {
        errors.responsible_user_id = 'ID должен быть положительным числом';
    }

    // Валидация telegram_field_id
    if (!data.telegram_field_id.trim()) {
        errors.telegram_field_id = 'ID поля Telegram обязателен';
    } else if (!/^\d+$/.test(data.telegram_field_id)) {
        errors.telegram_field_id = 'Должно быть целое число';
    } else if (Number(data.telegram_field_id) <= 0) {
        errors.telegram_field_id = 'ID должен быть положительным числом';
    }

    return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
    return Object.values(errors).some(error => error !== undefined && error !== '');
};

// Функция для преобразования CreateIntegrationRequest в ValidationData
export const toValidationData = (data: CreateIntegrationRequest): ValidationData => ({
    name: data.name,
    subdomain: data.subdomain,
    access_token: data.access_token,
    client_id: data.client_id,
    client_secret: data.client_secret,
    new_lead_pipeline_id: data.new_lead_pipeline_id.toString(),
    existing_lead_pipeline_id: data.existing_lead_pipeline_id.toString(),
    responsible_user_id: data.responsible_user_id.toString(),
    telegram_field_id: data.telegram_field_id.toString(),
    is_active: data.is_active
});