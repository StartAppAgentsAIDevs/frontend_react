import { api } from '../api';
import { AxiosError } from 'axios';

export interface ApiError {
    detail?: string | { msg: string; loc: string[] }[];
    message?: string;
    [key: string]: any;
}

export const deleteIntegration = async (
    integrationId: string,
    hardDelete: boolean = true // Изменено с false на true
): Promise<string> => {
    try {
        console.log('Удаление интеграции:', integrationId, 'hardDelete:', hardDelete);

        // DELETE запрос с параметром hard_delete
        const response = await api.delete<string>(`/amocrm/api/v1/integration/${integrationId}`, {
        });

        console.log('Интеграция успешно удалена:', response.data);
        return response.data;
    } catch (error: unknown) {
        console.error('Ошибка при удалении интеграции:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при удалении интеграции';

                // Обработка ошибок валидации
                if (axiosError.response.status === 422) {
                    if (errorData?.detail && Array.isArray(errorData.detail)) {
                        const validationErrors = errorData.detail
                            .map((err) => `${err.loc.join('.')}: ${err.msg}`)
                            .join('; ');
                        errorMessage = `Ошибка валидации: ${validationErrors}`;
                    } else {
                        errorMessage = 'Неверный ID интеграции';
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
                    errorMessage = 'Требуется авторизация для удаления интеграции';
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'У вас нет прав для удаления этой интеграции';
                } else if (axiosError.response.status === 404) {
                    errorMessage = 'Интеграция не найдена';
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при удалении интеграции');
    }
};