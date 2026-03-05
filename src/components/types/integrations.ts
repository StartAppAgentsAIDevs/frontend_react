// Тип для отправки в API
export interface CreateIntegrationRequest {
    name: string;
    subdomain: string;
    access_token: string;
    client_id: string;
    client_secret: string;
    new_lead_pipeline_id: number;
    existing_lead_pipeline_id: number;
    responsible_user_id: number;
    telegram_field_id: number;
    is_active: boolean;
    // Новые опциональные поля
    refresh_token?: string;
    telegram_field_name?: string;
    create_telegram_field?: boolean;
    auto_sync_enabled?: boolean;
    sync_hour?: number;
    // id проекта теперь часть тела запроса
    id?: string; // Добавляем опционально, так как будем передавать извне
}

// Тип для формы (с project_id для внутреннего использования)
export interface IntegrationFormData extends CreateIntegrationRequest {
    project_id: string; // Оставляем для внутреннего использования
}

export interface IntegrationResponse {
    id: string; // Это ID интеграции
    name: string;
    subdomain: string;
    access_token?: string; // Может не возвращаться
    client_id: string;
    client_secret?: string; // Может не возвращаться
    new_lead_pipeline_id: number;
    existing_lead_pipeline_id: number;
    responsible_user_id: number;
    telegram_field_id: number;
    telegram_field_name?: string;
    create_telegram_field?: boolean;
    auto_sync_enabled: boolean;
    sync_hour: number;
    is_active: boolean;
    last_sync_at: string | null;
    created_at: string;
    updated_at: string;
    // project_id не нужен, так как это отдельный эндпоинт
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ErrorResponse {
    detail: ValidationError[] | string;
}