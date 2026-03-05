import { CreateIntegrationRequest, IntegrationResponse } from '../../types/integrations';
import { api } from '../api';
import { AxiosError } from 'axios';

export interface ApiError {
    detail?: string | { msg: string, loc: string[] }[];
    message?: string;
    [key: string]: any;
}

export const createIntegration = async (data: CreateIntegrationRequest, projectId: string): Promise<IntegrationResponse> => {
    try {
        console.log('Создание интеграции для проекта:', projectId);

        // Приводим данные к формату API с новыми полями
        const requestData = {
            // ID проекта должен быть в теле запроса!
            id: projectId, // Это поле из схемы свагера - ID проекта
            
            name: data.name.trim(),
            subdomain: data.subdomain.trim().toLowerCase(),
            access_token: data.access_token.trim(),
            refresh_token: '',
            client_id: data.client_id.trim(),
            client_secret: data.client_secret.trim(),
            new_lead_pipeline_id: Number(data.new_lead_pipeline_id),
            existing_lead_pipeline_id: Number(data.existing_lead_pipeline_id),
            responsible_user_id: Number(data.responsible_user_id),
            telegram_field_id: Number(data.telegram_field_id),
            telegram_field_name: 'telegram',
            create_telegram_field: data.create_telegram_field || false,
            auto_sync_enabled: data.auto_sync_enabled ?? true,
            sync_hour: data.sync_hour || 3,
            is_active: data.is_active
        };

        console.log('Отправка данных в API:', requestData);

        // POST запрос с project_id в теле
        const response = await api.post<IntegrationResponse>('/amocrm/api/v1/integration/', requestData);

        console.log('Интеграция успешно создана:', response.data);

        return response.data;

    } catch (error: unknown) {
        console.error('Ошибка при создании интеграции:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при создании интеграции';

                // Обработка ошибок валидации
                if (axiosError.response.status === 422) {
                    if (errorData?.detail && Array.isArray(errorData.detail)) {
                        // Можно собрать все ошибки в одну строку
                        const validationErrors = errorData.detail
                            .map(err => `${err.loc.join('.')}: ${err.msg}`)
                            .join('; ');
                        errorMessage = `Ошибка валидации: ${validationErrors}`;
                    } else {
                        errorMessage = 'Проверьте правильность заполнения полей';
                    }
                } else if (errorData?.detail) {
                    if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail;
                    }
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }

                if (axiosError.response.status === 401) {
                    errorMessage = 'Требуется авторизация для создания интеграции';
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'У вас нет прав для создания интеграции';
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при создании интеграции');
    }
};