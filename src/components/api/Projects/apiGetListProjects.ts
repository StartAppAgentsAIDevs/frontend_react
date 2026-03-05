import { ProjectResponse } from '../../types/project';
import { api } from '../api';
import { AxiosError } from 'axios';

export interface ApiError {
    detail?: string | { msg: string }[];
    message?: string;
    [key: string]: any;
}

export const getOrganizationProjects = async (organizationId: string): Promise<ProjectResponse[]> => {
    try {
        console.log(`Запрос проектов организации ${organizationId}...`);

        const response = await api.get<ProjectResponse[]>(`/projects/organization/${organizationId}`);

        console.log('Проекты организации получены:', response.data);
        return response.data;

    } catch (error: unknown) {
        console.error('Ошибка при получении проектов организации:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при получении списка проектов';

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
                    errorMessage = 'Требуется авторизация для просмотра проектов';
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'У вас нет доступа к проектам этой организации';
                } else if (axiosError.response.status === 404) {
                    errorMessage = 'Организация не найдена';
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при получении проектов');
    }
};

export const getProjectById = async (projectId: string): Promise<ProjectResponse> => {
    try {
        console.log(`Запрос проекта ${projectId}...`);

        const response = await api.get<ProjectResponse>(`/projects/${projectId}`);

        console.log('Проект получен:', response.data);
        return response.data;

    } catch (error: unknown) {
        console.error('Ошибка при получении проекта:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при получении данных проекта';

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
                    errorMessage = 'Требуется авторизация для просмотра проекта';
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'У вас нет доступа к этому проекту';
                } else if (axiosError.response.status === 404) {
                    errorMessage = 'Проект не найден';
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при получении проекта');
    }
};

// Дополнительные полезные функции для работы с проектами

export const formatProjectDate = (dateString: string): string => {
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

export const getProjectStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
        'active': 'Активен',
        'completed': 'Завершен',
        'archived': 'В архиве',
        'pending': 'Ожидает',
        'suspended': 'Приостановлен'
    };
    return statusMap[status] || status;
};

export const getProjectLanguageText = (language: string): string => {
    const languageMap: Record<string, string> = {
        'ru': 'Русский',
        'en': 'Английский',
        'es': 'Испанский',
        'de': 'Немецкий',
        'fr': 'Французский',
        'zh': 'Китайский',
        'ja': 'Японский'
    };
    return languageMap[language] || language;
};

export const getProjectStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        'active': '#2ed573',
        'completed': '#ff9f43',
        'archived': '#6c5ce7',
        'pending': '#ff4757',
        'suspended': '#ff6b81'
    };
    return colorMap[status] || '#ffffff';
};