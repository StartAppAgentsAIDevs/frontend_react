import { IntegrationResponse } from '../../types/integrations';
import { api } from '../api';
import { AxiosError } from 'axios';

export interface ApiError {
    detail?: string | { msg: string }[];
    message?: string;
    [key: string]: any;
}

export const getProjectIntegrations = async (projectId: string): Promise<IntegrationResponse[]> => {
    try {
        console.log('Запрос интеграций для проекта:', projectId);

        // Используем projectId как integration_id в URL
        const response = await api.get<IntegrationResponse>(`/amocrm/api/v1/integration/${projectId}`);

        console.log('Интеграция получена:', response.data);

        // Возвращаем массив с одной интеграцией (или пустой массив, если 404)
        return [response.data];

    } catch (error: unknown) {
        // Если ошибка 404 - интеграция не найдена, возвращаем пустой массив
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.status === 404) {
                console.log('Интеграция не найдена для проекта', projectId);
                return [];
            }
        }

        console.error('Ошибка при получении интеграции:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при получении интеграции';

                if (errorData?.detail) {
                    if (Array.isArray(errorData.detail)) {
                        const firstError = errorData.detail[0];
                        errorMessage = firstError?.msg || 'Ошибка валидации';
                    } else if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail;
                    }
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }

                if (axiosError.response.status === 401) {
                    errorMessage = 'Требуется авторизация для просмотра интеграции';
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'У вас нет доступа к интеграции';
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при получении интеграции');
    }
};

// Вспомогательные функции для форматирования
export const formatIntegrationDate = (dateString: string | null): string => {
    if (!dateString) return 'Никогда';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Дата не указана';
    }
};

export const maskSecretKey = (key: string): string => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
};